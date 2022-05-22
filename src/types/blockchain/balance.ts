import { TokenType } from 'src/types/blockchain/token';

export interface Balance {
  userId: string;
  balance: TokenBalances | null;
}

export interface TotalBalance {
  userId: string;
  balance: TokenBalances | null;
  pendingBalance: TokenBalances | null;
  value: TokenBalances | null;
  pendingValue: TokenBalances | null;
}

type TokenBalances = { [key in TokenType]: number };
