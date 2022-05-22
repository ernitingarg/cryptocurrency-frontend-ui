import { TokenType } from 'src/types/blockchain/token';

export interface ConvertHistory {
  amount: number;
  timestamp: number;
  fromCurrency: TokenType;
  toCurrency: TokenType;
  rate: number;
  status: 'done' | 'sent' | 'pending';
  userId: string;
}
