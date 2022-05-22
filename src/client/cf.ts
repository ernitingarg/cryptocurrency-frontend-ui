import Axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { CF_HOST, CF_PATHS } from 'src/constants/cf';
import { TokenType } from 'src/types/blockchain/token';
import { wrappedPromiseFn } from 'src/util/promise';
import authClient from './auth';

type BlockchainType = 'bitcoin' | 'ethereum';

export class CfClient {
  private readonly client: AxiosInstance;
  constructor(baseURL: string) {
    this.client = Axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      responseType: 'json',
    });
  }
  private static async createAuthHeader(): Promise<{ Authorization: string }> {
    const idToken = await authClient.getIdToken().catch(console.error);
    if (!idToken) {
      throw new Error('invalid current user. no exists idToken');
    }
    return {
      Authorization: `Bearer ${idToken}`,
    };
  }

  private cfCall = async <Param, Return>(path: string, data: Param) => {
    const _client = this.client;
    const headers = await CfClient.createAuthHeader();
    const fn = () => _client.post<AxiosResponse<Return>, AxiosError>(path, { data }, { headers });
    return wrappedPromiseFn(fn);
  };

  createBtcAccount = () => {
    const data: { blockchainType: BlockchainType } = { blockchainType: 'bitcoin' };
    return this.cfCall(CF_PATHS.allocateWalletAddress, data);
  };

  createEthAccount = () => {
    const data: { blockchainType: BlockchainType } = { blockchainType: 'ethereum' };
    return this.cfCall(CF_PATHS.allocateWalletAddress, data);
  };

  convertToken = (data: { from_currency: TokenType; to_currency: TokenType; amount: number; argrate: number }) => {
    return this.cfCall(CF_PATHS.convertToken, data);
  };

  withdrawRequest = (data: { currency: TokenType; amount: number; to: string }) => {
    return this.cfCall(CF_PATHS.withdrawRequestProxy, data);
  };
}

const cfClient = new CfClient(CF_HOST);

export default cfClient;
