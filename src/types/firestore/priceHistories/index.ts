import { TokenPair } from 'src/types/blockchain/token';

export interface FirestorePriceHistory {
  currency_pair: TokenPair;
  market: string;
  rate: number;
  source: 'FTX';
  timestamp: number;
}
