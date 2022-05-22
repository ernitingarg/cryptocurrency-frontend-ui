import { FirestoreError, Query } from '@firebase/firestore-types';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { decimalAmount } from 'src/lib/exchange/price';
import firestore from 'src/lib/firebase/firestore';
import { InterestPaymentHistory } from 'src/types/blockchain/interestPaymentHistory';
import { NativeToken } from 'src/types/blockchain/token';
import { FirestoreInterestPaymentHistory } from 'src/types/firestore/interestPaymentHistories';
dayjs.extend(utc);

const PARENT_COL = 'interest_payment_histories';
const COL = 'histories';

interface InterestPaymentHistoryCondition {
  datetime?: {
    from?: dayjs.Dayjs | null;
    to?: dayjs.Dayjs | null;
  };
}

export type { InterestPaymentHistoryCondition };

export default class InterestPaymentHistoryRepository {
  private colRef = (userId: string) => firestore.collection(PARENT_COL).doc(userId).collection(COL);

  subscribePagination = async (
    userId: string,
    page: number,
    perPage: number,
    by: keyof FirestoreInterestPaymentHistory,
    direction: 'asc' | 'desc' = 'asc',
    onGetData: (histories: InterestPaymentHistory[]) => void,
    onError?: (error: FirestoreError) => void,
    condition?: InterestPaymentHistoryCondition,
  ): Promise<void> => {
    let query: Query;
    if (page == 1) {
      query = this.colRef(userId).orderBy(by, direction).limit(perPage);
    } else {
      const headQuery = this.colRef(userId)
        .orderBy(by, direction)
        .limit((page - 1) * perPage + 1);
      const headDocSnapshot = await InterestPaymentHistoryRepository.setQuery(headQuery, condition).get();
      if (!headDocSnapshot.docs.length) {
        return;
      }

      query = this.colRef(userId)
        .orderBy(by, direction)
        .limit(perPage)
        .startAt(headDocSnapshot.docs[headDocSnapshot.docs.length - 1]);
    }

    await InterestPaymentHistoryRepository.setQuery(query, condition).onSnapshot((snapshot) => {
      const firestoreHistories = snapshot.docs
        .filter((doc) => doc.exists)
        .map((doc) => doc.data() as FirestoreInterestPaymentHistory);

      onGetData(
        firestoreHistories.map((h) => {
          const usdsBalance = decimalAmount(h.pre_balance + h.amount, NativeToken);
          const dailyInterestRate = h.amount / usdsBalance;
          return {
            dailyInterestRate,
            usdsBalance,
            interestPayment: h.amount,
            timestamp: h.timestamp,
          };
        }),
      );
    }, onError);
  };

  count = async (userId: string, condition?: InterestPaymentHistoryCondition): Promise<number> => {
    const query = this.colRef(userId);
    const snapshot = await InterestPaymentHistoryRepository.setQuery(query, condition).get();
    return snapshot.docs.length;
  };

  private static setQuery(query: Query, condition: InterestPaymentHistoryCondition | undefined): Query {
    let newQuery = query;
    if (condition?.datetime?.from) {
      newQuery = newQuery.where('timestamp', '>=', condition?.datetime?.from?.utc().startOf('day').unix());
    }
    if (condition?.datetime?.to) {
      newQuery = newQuery.where('timestamp', '<', condition?.datetime?.to?.utc().add(1, 'day').startOf('day').unix());
    }
    return newQuery;
  }

  subscribeOrderBy = (
    next: (histories: InterestPaymentHistory[] | null) => void,
    userId: string,
    by: keyof FirestoreInterestPaymentHistory,
    direction: 'asc' | 'desc' = 'asc',
    limit = 20,
    onError?: (error: Error) => void,
  ) =>
    this.colRef(userId)
      .orderBy(by, direction)
      .limit(limit)
      .onSnapshot(
        (snaps) => {
          if (snaps.empty || snaps.docs.length <= 0) {
            next(null);
            return;
          }

          const firestoreHistories = snaps.docs
            .filter((doc) => doc.exists)
            .map((doc) => doc.data() as FirestoreInterestPaymentHistory);

          const histories: InterestPaymentHistory[] = firestoreHistories.map((h) => {
            const usdsBalance = decimalAmount(h.pre_balance + h.amount, NativeToken);
            const dailyInterestRate = h.amount / usdsBalance;
            return {
              dailyInterestRate,
              usdsBalance,
              interestPayment: h.amount,
              timestamp: h.timestamp,
            };
          });
          next(histories);
        },
        (error) => {
          if (!onError) return;
          onError(error);
        },
      );
}
