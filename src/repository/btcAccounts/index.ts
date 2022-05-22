import firestore from 'src/lib/firebase/firestore';
import { BtcAccount } from 'src/types/blockchain/account';
import { FirestoreBtcAccount } from 'src/types/firestore/btcAccounts';

const COLLECTION = 'btc_accounts';
class BtcAccountRepository {
  private docRef = (docId: string) => firestore.collection(COLLECTION).doc(docId);
  subscribe = (docId: string, next: (account: BtcAccount | null) => void) =>
    this.docRef(docId).onSnapshot((snapshot) => {
      if (!snapshot.exists) {
        next(null);
        return;
      }
      const data = snapshot.data() as FirestoreBtcAccount;
      const account: BtcAccount = { userId: data.user_id, address: data.address, type: 'bitcoin' };
      next(account);
    });
}

const btcAccountRepository = new BtcAccountRepository();

export default btcAccountRepository;
