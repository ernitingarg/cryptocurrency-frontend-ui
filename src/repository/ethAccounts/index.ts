import firestore from 'src/lib/firebase/firestore';
import { EthAccount } from 'src/types/blockchain/account';
import { FirestoreEthAccount } from 'src/types/firestore/ethAccounts';

const COLLECTION = 'eth_accounts';
class EthAccountRepository {
  private docRef = (docId: string) => firestore.collection(COLLECTION).doc(docId);
  subscribe = (docId: string, next: (account: EthAccount | null) => void) =>
    this.docRef(docId).onSnapshot((snapshot) => {
      if (!snapshot.exists) {
        next(null);
        return;
      }
      const data = snapshot.data() as FirestoreEthAccount;
      const account: EthAccount = { userId: data.user_id, address: data.address, type: 'ethereum' };
      next(account);
    });
}

const ethAccountRepository = new EthAccountRepository();

export default ethAccountRepository;
