import { useCallback } from 'react';
import cfClient from 'src/client/cf';
import { TokenType } from 'src/types/blockchain/token';

export const useWithdrawToken = () => {
  return useCallback(async (amount: number, currency: TokenType, to: string) => {
    // TODO: withdraw tokenの実装
    await cfClient.withdrawRequest({ currency, amount, to });
  }, []);
};
