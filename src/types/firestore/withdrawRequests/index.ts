import { TokenType } from 'src/types/blockchain/token';

export interface FirestoreWithdrawRequest {
  amount: number;
  currency: TokenType;
  datetime: string;
  status: 'done' | 'pending';
  to: string;
  user: string;
}
