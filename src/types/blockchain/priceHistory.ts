import { TokenPair } from 'src/types/blockchain/token';

export interface PriceHistory {
  currencyPair: TokenPair;
  market: string;
  rate: number;
  source: 'FTX';
  timestamp: number;
}
