import { FirestoreError, Query } from '@firebase/firestore-types';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { decimalAmount } from 'src/lib/exchange/price';
import firestore from 'src/lib/firebase/firestore';
import { DepositHistory } from 'src/types/blockchain/depositHistory';
import { NativeToken } from 'src/types/blockchain/token';
import { FirestoreUsdsTransaction } from 'src/types/firestore/usdsTransactions';
dayjs.extend(utc);

const COL = 'usds_transactions';

interface DepositHistoryCondition {
  datetime?: {
    from?: dayjs.Dayjs | null;
    to?: dayjs.Dayjs | null;
  };
}

export type { DepositHistoryCondition };

export default class UsdsTransactionRepository {
  private colRef = () => firestore.collection(COL);

  subScribePagination = async (
    userId: string,
    address: string,
    page: number,
    perPage: number,
    by: keyof FirestoreUsdsTransaction,
    direction: 'asc' | 'desc' = 'asc',
    onGetData: (histories: DepositHistory[]) => void,
    onError?: (error: FirestoreError) => void,
    condition?: DepositHistoryCondition,
  ): Promise<void> => {
    let query: Query;
    if (page == 1) {
      query = this.colRef().where('to', '==', address).orderBy(by, direction).limit(perPage);
    } else {
      const headQuery = this.colRef()
        .where('to', '==', address)
        .orderBy(by, direction)
        .limit((page - 1) * perPage + 1);
      const headDocSnapshot = await UsdsTransactionRepository.setQuery(headQuery, condition).get();
      if (!headDocSnapshot.docs.length) {
        return;
      }
      query = this.colRef()
        .where('to', '==', address)
        .orderBy(by, direction)
        .limit(perPage)
        .startAt(headDocSnapshot.docs[headDocSnapshot.docs.length - 1]);
    }

    UsdsTransactionRepository.setQuery(query, condition).onSnapshot((snapshot) => {
      const firestoreHistories = snapshot.docs
        .filter((doc) => doc.exists)
        .map((doc) => doc.data() as FirestoreUsdsTransaction);

      onGetData(
        firestoreHistories.map(
          (h): DepositHistory => ({
            tokenType: NativeToken,
            amount: decimalAmount(h.amount, NativeToken),
            timestamp: h.timestamp,
            status: 'done',
            userId,
          }),
        ),
      );
    }, onError);
  };

  count = async (address: string, condition?: DepositHistoryCondition): Promise<number> => {
    const query = this.colRef().where('to', '==', address).orderBy('timestamp', 'desc');

    const snapshot = await UsdsTransactionRepository.setQuery(query, condition).get();
    return snapshot.docs.length;
  };

  private static setQuery(query: Query, condition: DepositHistoryCondition | undefined): Query {
    let newQuery = query;
    if (condition?.datetime?.from) {
      newQuery = newQuery.where('timestamp', '>=', condition?.datetime?.from?.utc().startOf('day').unix());
    }
    if (condition?.datetime?.to) {
      newQuery = newQuery.where('timestamp', '<', condition?.datetime?.to?.utc().add(1, 'day').startOf('day').unix());
    }
    return newQuery;
  }

  subscribeDepositHistories = (
    next: (histories: DepositHistory[] | null) => void,
    userId: string,
    address: string,
    limit = 20,
    onError?: (error: Error) => void,
  ) => {
    return this.colRef()
      .where('to', '==', address)
      .limit(limit)
      .onSnapshot(
        (snaps) => {
          if (snaps.empty || snaps.docs.length <= 0) {
            next(null);
            return;
          }

          const firestoreTransactions = snaps.docs
            .filter((doc) => doc.exists)
            .map((doc) => doc.data() as FirestoreUsdsTransaction);

          const histories: DepositHistory[] = firestoreTransactions.map(
            (h): DepositHistory => ({
              tokenType: NativeToken,
              amount: decimalAmount(h.amount, NativeToken),
              timestamp: h.timestamp,
              status: 'done',
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
