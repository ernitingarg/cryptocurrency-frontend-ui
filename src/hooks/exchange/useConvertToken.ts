import { useCallback } from 'react';
import cfClient from 'src/client/cf';
import { TokenType } from 'src/types/blockchain/token';

export const useConvertToken = () => {
  return useCallback(async (from_amount: number, from_currency: TokenType, to_currency: TokenType, argrate: number) => {
    await cfClient.convertToken({ amount: Number(from_amount), from_currency, to_currency, argrate });
  }, []);
};
