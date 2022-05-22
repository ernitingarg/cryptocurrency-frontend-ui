import firestore from 'src/lib/firebase/firestore';
import { TokenType } from 'src/types/blockchain/token';
import { FirestoreConversionFeeRate } from 'src/types/firestore/conversionFeeRate';

const COLLECTION = 'conversion_fee_rate';
export default class ConversionFeeRateRepository {
  private docRef = (rateType: string) => firestore.collection(COLLECTION).doc(rateType);
  private fromTokenToRateType = (fromToken: TokenType, toToken: TokenType): string => {
    return `${fromToken}2${toToken}`;
  };

  subscribe = (fromType: TokenType, toType: TokenType, next: (rate: number | null) => void) =>
    this.docRef(this.fromTokenToRateType(fromType, toType)).onSnapshot((snapshot) => {
      if (!snapshot.exists) {
        next(null);
        return;
      }
      const data = snapshot.data() as FirestoreConversionFeeRate;
      next(data.fee_rate);
    });
  get = async (fromType: TokenType, toType: TokenType) => {
    const snap = await this.docRef(this.fromTokenToRateType(fromType, toType)).get();
    if (!snap.exists) {
      throw new Error('snapshot is not exist');
    }

    const feeRate = snap.data() as FirestoreConversionFeeRate | undefined;
    if (!feeRate) {
      throw new Error('feeRate is undefined');
    }

    return feeRate.fee_rate;
  };
}
