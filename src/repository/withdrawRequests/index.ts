import { FirestoreError, Query } from '@firebase/firestore-types';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { decimalAmount } from 'src/lib/exchange/price';
import firestore from 'src/lib/firebase/firestore';
import { ConvertHistoryCondition } from 'src/repository/convertHistories';
import { WithdrawHistory } from 'src/types/blockchain/withdrawHistory';
import { FirestoreWithdrawRequest } from 'src/types/firestore/withdrawRequests';
dayjs.extend(utc);

const COL = 'withdrawal_requests';

interface WithdrawHistoryCondition {
  datetime?: {
    from?: dayjs.Dayjs | null;
    to?: dayjs.Dayjs | null;
  };
}

export type { WithdrawHistoryCondition };

export default class WithdrawRequestRepository {
  private colRef = () => firestore.collection(COL);

  subScribePagination = async (
    userId: string,
    page: number,
    perPage: number,
    by: keyof FirestoreWithdrawRequest,
    direction: 'asc' | 'desc' = 'asc',
    onGetData: (histories: WithdrawHistory[]) => void,
    onError?: (error: FirestoreError) => void,
    condition?: WithdrawHistoryCondition,
  ): Promise<void> => {
    let query: Query;
    if (page == 1) {
      query = this.colRef().where('user', '==', userId).orderBy(by, direction).limit(perPage);
    } else {
      const headQuery = this.colRef()
        .where('user', '==', userId)
        .orderBy(by, direction)
        .limit((page - 1) * perPage + 1);
      const headDocSnapshot = await WithdrawRequestRepository.setQuery(headQuery, condition).get();
      if (!headDocSnapshot.docs.length) {
        return;
      }

      query = this.colRef()
        .where('user', '==', userId)
        .orderBy(by, direction)
        .limit(perPage)
        .startAt(headDocSnapshot.docs[headDocSnapshot.docs.length - 1]);
    }

    await WithdrawRequestRepository.setQuery(query, condition).onSnapshot((snapshot) => {
      const firestoreHistories = snapshot.docs
        .filter((doc) => doc.exists)
        .map((doc) => doc.data() as FirestoreWithdrawRequest);

      onGetData(
        firestoreHistories.map(
          (h): WithdrawHistory => ({
            tokenType: h.currency,
            amount: decimalAmount(h.amount, h.currency),
            timestamp: dayjs.utc(h.datetime).unix(),
            status: h.status,
            userId,
          }),
        ),
      );
    }, onError);
  };

  count = async (userId: string, condition?: WithdrawHistoryCondition): Promise<number> => {
    const query = this.colRef().where('user', '==', userId).orderBy('datetime', 'desc');

    const snapshot = await WithdrawRequestRepository.setQuery(query, condition).get();
    return snapshot.docs.length;
  };

  private static setQuery(query: Query, condition: ConvertHistoryCondition | undefined): Query {
    let newQuery = query;
    if (condition?.datetime?.from) {
      newQuery = newQuery.where('datetime', '>=', condition?.datetime?.from?.format('YYYY-MM-DD'));
    }
    if (condition?.datetime?.to) {
      newQuery = newQuery.where('datetime', '<=', condition?.datetime?.to?.format('YYYY-MM-DD 23:59:59'));
    }
    return newQuery;
  }

  subscribeByUser = (
    next: (histories: WithdrawHistory[] | null) => void,
    userId: string,
    limit = 20,
    onError?: (error: Error) => void,
  ) => {
    return this.colRef()
      .where('user', '==', userId)
      .limit(limit)
      .onSnapshot(
        (snaps) => {
          if (snaps.empty || snaps.docs.length <= 0) {
            next(null);
            return;
          }

          const firestoreTransactions = snaps.docs
            .filter((doc) => doc.exists)
            .map((doc) => doc.data() as FirestoreWithdrawRequest);

          const histories: WithdrawHistory[] = firestoreTransactions.map(
            (h): WithdrawHistory => ({
              tokenType: h.currency,
              amount: decimalAmount(h.amount, h.currency),
              timestamp: dayjs(h.datetime).unix(),
              status: h.status,
              userId,
            }),
          );
          next(histories);
        },
        (error) => {
          if (!onError) return;
          onError(error);
        },
      );
  };
}
