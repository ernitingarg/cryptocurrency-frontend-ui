import Axios, { AxiosInstance } from 'axios';
import { wrappedPromiseFn } from 'src/util/promise';

interface BaseResponse<T> {
  code: number;
  detailMsg: string;
  msg: string;
  data: T;
}

interface IndexConstituents {
  last: string;
  constituents: {
    symbol: string;
    original_price: string;
    weight: string;
    usd_price: string;
    exchange: string;
  }[];
}

export class OkexClient {
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

  private get = <Param, Return>(path: string, param: Param) => {
    const _client = this.client;
    // const headers = await CfClient.createAuthHeader();
    const fn = () => _client.get<Return>(path, param);
    return wrappedPromiseFn(fn);
  };

  getIndexConstituents = (instrumentId: string) => {
    return this.get<any, BaseResponse<IndexConstituents>>(`/api/index/v3/${instrumentId}/constituents`, {});
  };
}

const okexClient = new OkexClient('https://www.okex.com');
export default okexClient;
