export const CF_HOST = process.env.CF_HOST as string;

// deprecated
const createBtcAccount = '/CreateBtcAccount';
// deprecated
const createEthAccount = '/CreateEthAccount';

const allocateWalletAddress = '/allocateWalletAddress';
const convertToken = '/convertRequestProxy';
const withdrawRequestProxy = '/withdrawRequestProxy';
export const CF_PATHS = {
  createBtcAccount,
  createEthAccount,
  convertToken,
  withdrawRequestProxy,
  allocateWalletAddress,
};
