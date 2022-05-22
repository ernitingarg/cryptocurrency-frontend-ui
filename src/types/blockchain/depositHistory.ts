import { TokenType } from 'src/types/blockchain/token';

export interface DepositHistory {
  amount: number;
  timestamp: number;
  tokenType: TokenType;
  status: 'done' | 'pending';
  userId: string;
}
