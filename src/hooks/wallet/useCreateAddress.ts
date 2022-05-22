import { useCallback } from 'react';
import cfClient from 'src/client/cf';
import { BlockChainType } from 'src/types/blockchain/chain';

export const useCreateAddress = (type: BlockChainType) => {
  return useCallback(() => {
    switch (type) {
      case 'bitcoin':
        return cfClient.createBtcAccount();
      case 'ethereum':
        return cfClient.createEthAccount();
      default:
        throw new Error('chain type is invalid');
    }
  }, [type]);
};
