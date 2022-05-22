import { QuerySnapshot } from '@firebase/firestore-types';
import firestore from 'src/lib/firebase/firestore';
import { PriceHistory } from 'src/types/blockchain/priceHistory';
import { TokenPair } from 'src/types/blockchain/token';
import { FirestorePriceHistory } from 'src/types/firestore/priceHistories';

const COL = 'price_histories';

const timestampField: keyof FirestorePriceHistory = 'timestamp';
const currencyPairField: keyof FirestorePriceHistory = 'currency_pair';

export default class PriceHistoryRepository {
  private colRef = (tokenPair: TokenPair) => firestore.collection(COL).where(currencyPairField, '==', tokenPair);

  subscribeLatestOne = (
    tokenPair: TokenPair,
    next: (history: PriceHistory | null) => void,
    onError?: (error: Error) => void,
  ) => {
    return this.colRef(tokenPair)
      .orderBy(timestampField, 'desc')
      .limit(1)
      .onSnapshot(
        (snaps) => {
          next(this.createPriceHistory(snaps));
        },
        (error) => {
          if (!onError) return;
          onError(error);
        },
      );
  };

  subscribeOneDayAgo = (
    tokenPair: TokenPair,
    next: (history: PriceHistory | null) => void,
    onError?: (error: Error) => void,
  ) => {
    return this.subscribeLatestOne(
      tokenPair,
      (history) => {
        if (!history) {
          next(null);
        }
        const lastTimestamp = history?.timestamp as number;
        const oneDayAgo = new Date(lastTimestamp * 1000);
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);
        const oldTimestamp = oneDayAgo.getTime() / 1000;

        this.colRef(tokenPair)
          .where(timestampField, '>=', oldTimestamp)
          .orderBy(timestampField, 'asc')
          .limit(1)
          .onSnapshot(
            (snaps) => {
              next(this.createPriceHistory(snaps));
            },
            (error) => {
              if (!onError) return;
              onError(error);
            },
          );
      },
      (error) => {
        if (!onError) return;
        onError(error);
      },
    );
  };

  private createPriceHistory = (snapshot: QuerySnapshot) => {
    if (snapshot.empty || snapshot.docs.length <= 0) {
      return null;
    }
    const doc = snapshot.docs[0];
    const data = doc.data() as FirestorePriceHistory | undefined;
    if (!data) {
      return null;
    }

    const priceHistory: PriceHistory = {
      currencyPair: data.currency_pair,
      market: data.market,
      rate: data.rate,
      timestamp: data.timestamp,
      source: data.source,
    };
    return priceHistory;
  };
}
