import { useMemo } from 'react';
import { Balance } from 'src/types/blockchain/balance';
import { TokenType } from 'src/types/blockchain/token';

export const useFormalPrice = (balance: Balance | null, type: TokenType) => {
  return useMemo(() => {
    if (!balance) return;

    return balance.balance?.[type];
  }, [type, balance]);
};
