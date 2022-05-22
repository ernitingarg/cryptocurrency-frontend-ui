export default class NextApiPath {
  static indexPrice = (instrumentId: string) => `/api/index_price/${instrumentId}`;
}
