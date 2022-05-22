import { Bitcoin, Ethereum } from './chain';

export interface BtcAccount {
  address: string;
  userId: string;
  type: Bitcoin;
}

export interface EthAccount {
  address: string;
  userId: string;
  type: Ethereum;
}

export type Account = BtcAccount | EthAccount;
