import { FirestoreError, Query } from '@firebase/firestore-types';
import dayjs from 'dayjs';
import { decimalAmount } from 'src/lib/exchange/price';
import firestore from 'src/lib/firebase/firestore';
import { ConvertHistory } from 'src/types/blockchain/convertHistory';
import { FirestoreConvertHistory } from 'src/types/firestore/convertHistories';

const PARENT_COL = 'convert_history';
const COL = 'history';

interface ConvertHistoryCondition {
  datetime?: {
    from?: dayjs.Dayjs | null;
    to?: dayjs.Dayjs | null;
  };
}

export type { ConvertHistoryCondition };

export default class ConvertHistoryRepository {
  private colRef = (userId: string) => firestore.collection(PARENT_COL).doc(userId).collection(COL);

  subscribePagination = async (
    userId: string,
    page: number,
    perPage: number,
    by: keyof FirestoreConvertHistory,
    direction: 'asc' | 'desc' = 'asc',
    onGetData: (histories: ConvertHistory[]) => void,
    onError?: (error: FirestoreError) => void,
    condition?: ConvertHistoryCondition,
  ): Promise<void> => {
    let query: Query;
    if (page == 1) {
      query = this.colRef(userId).orderBy(by, direction).limit(perPage);
    } else {
      // 2ページ目以降はstartAtによって新しいデータが追加されても即時反映されない可能性がある
      const headQuery = this.colRef(userId)
        .orderBy(by, direction)
        .limit((page - 1) * perPage + 1);
      const headDocSnapshot = await ConvertHistoryRepository.setQuery(headQuery, condition).get();
      if (!headDocSnapshot.docs.length) {
        return;
      }
      query = this.colRef(userId)
        .orderBy(by, direction)
        .limit(perPage)
        .startAt(headDocSnapshot.docs[headDocSnapshot.docs.length - 1]);
    }

    ConvertHistoryRepository.setQuery(query, condition).onSnapshot((snapshot) => {
      const firestoreHistories = snapshot.docs
        .filter((doc) => doc.exists)
        .map((doc) => doc.data() as FirestoreConvertHistory);

      onGetData(
        firestoreHistories.map((h) => ({
          amount: decimalAmount(h.amount, h.from_currency),
          timestamp: dayjs(h.datetime).unix(),
          fromCurrency: h.from_currency,
          toCurrency: h.to_currency,
          status: h.status,
          userId: h.user,
          rate: h.rate,
        })),
      );
    }, onError);
  };

  count = async (userId: string, condition?: ConvertHistoryCondition): Promise<number> => {
    const query = this.colRef(userId);
    const snapshot = await ConvertHistoryRepository.setQuery(query, condition).get();
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

  subscribeOrderBy = (
    next: (histories: ConvertHistory[] | null) => void,
    userId: string,
    by: keyof FirestoreConvertHistory,
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
            .map((doc) => doc.data() as FirestoreConvertHistory);

          const histories: ConvertHistory[] = firestoreHistories.map((h) => ({
            amount: decimalAmount(h.amount, h.from_currency),
            timestamp: dayjs(h.datetime).unix(),
            fromCurrency: h.from_currency,
            toCurrency: h.to_currency,
            status: h.status,
            userId: h.user,
            rate: h.rate,
          }));
          next(histories);
        },
        (error) => {
          if (!onError) return;
          onError(error);
        },
      );
}
