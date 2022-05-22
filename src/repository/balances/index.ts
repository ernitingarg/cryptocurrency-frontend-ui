import { decimalAmount } from 'src/lib/exchange/price';
import firestore from 'src/lib/firebase/firestore';
import { Balance } from 'src/types/blockchain/balance';
import { FirestoreBalance } from 'src/types/firestore/balances/state';

export type BalanceCol = 'balances' | 'pending_balances';
export default class BalanceRepository {
  colName: BalanceCol;
  constructor(colName: BalanceCol) {
    this.colName = colName;
  }

  private docRef = (uid: string) => firestore.collection(this.colName).doc(uid);

  subscribe = (uid: string, next: (account: Balance | null) => void) =>
    this.docRef(uid).onSnapshot((snapshot) => {
      if (!snapshot.exists) {
        next(null);
        return;
      }
      const data = snapshot.data() as FirestoreBalance | undefined;
      if (!data) {
        next(null);
        return;
      }
      const balance: Balance = {
        userId: uid,
        balance: {
          BTC: decimalAmount(data.BTC ?? 0, 'BTC'),
          ETH: decimalAmount(data.ETH ?? 0, 'ETH'),
          USDS: decimalAmount(data.USDS ?? 0, 'USDS'),
          USDC: decimalAmount(data.USDC ?? 0, 'USDC'),
          USDT: decimalAmount(data.USDT ?? 0, 'USDT'),
        },
      };
      next(balance);
    });
}
