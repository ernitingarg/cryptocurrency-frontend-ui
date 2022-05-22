import { TokenType } from 'src/types/blockchain/token';

export interface FirestoreConvertHistory {
  amount: number;
  datetime: string;
  from_currency: TokenType;
  to_currency: TokenType;
  rate: number;
  status: 'done' | 'sent' | 'pending';
  user: string;
}
