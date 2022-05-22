import { TokenType } from 'src/types/blockchain/token';
import dayjs from 'dayjs';

export interface History {
  amount: number;
  tokenType: TokenType;
  status: 'done' | 'pending';
  datetime: dayjs.Dayjs;
}
