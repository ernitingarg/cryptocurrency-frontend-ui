import { useEffect, useMemo, useReducer, useRef } from 'react';
import { useLastPrice } from 'src/hooks/exchange/useLastPrice';
import BalanceRepository, { BalanceCol } from 'src/repository/balances';
import { Balance, TotalBalance } from 'src/types/blockchain/balance';
import { TokenPair, TokenType, tokenTypes } from 'src/types/blockchain/token';
import { Status } from 'src/types/common/loading';
import { useAuthContext } from '../auth/useAuthContext';

type State = {
  status: Status;
  balance: Balance | null;
};

type TotalState = {
  status: Status;
  balance: TotalBalance | null;
};

const initState: State = { status: 'initial', balance: null };

type Action =
  | {
      type: 'setStatus';
      status: Status;
    }
  | {
      type: 'setBalance';
      balance: Balance | null;
    };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'setStatus':
      return {
        ...state,
        status: action.status,
      };
    case 'setBalance':
      return {
        ...state,
        status: 'loaded',
        balance: action.balance,
      };
    default:
      return state;
  }
};

export const useBalanceByType = (balanceCol: BalanceCol) => {
  const balanceRepositoryRef = useRef(new BalanceRepository(balanceCol));
  const [state, dispatch] = useReducer(reducer, initState);
  const { uid } = useAuthContext();
  useEffect(() => {
    if (!uid) {
      dispatch({ type: 'setBalance', balance: null });
      return;
    }
    const unsubscribe = balanceRepositoryRef.current.subscribe(uid, (balance) => {
      dispatch({ type: 'setBalance', balance });
    });

    return unsubscribe;
  }, [uid]);

  return state;
};

const GetPrice = (tokenType: TokenType): number | undefined => {
  const [price] = useLastPrice(`${tokenType}-USD` as TokenPair);
  return price;
};

export const useBalance = (): TotalState => {
  const balanceState = useBalanceByType('balances');
  const pendingBalanceState = useBalanceByType('pending_balances');

  const userId = balanceState.balance?.userId;
  const tokenBalances = balanceState.balance?.balance || null;
  const tokenPendingBalances = pendingBalanceState.balance?.balance || null;

  const prices: { [key: string]: number | undefined } = {};
  tokenTypes.map((tokenType: TokenType) => {
    prices[tokenType] = GetPrice(tokenType);
  });

  const balance: TotalState['balance'] = useMemo((): TotalBalance | null => {
    const tokenValues = Object.assign({}, tokenBalances);
    const tokenPendingValues = Object.assign({}, tokenPendingBalances);

    tokenTypes.map((tokenType: TokenType) => {
      const tokenBalance = tokenBalances?.[tokenType] || 0;
      tokenValues[tokenType] = tokenBalance * (prices[tokenType] ?? 0);

      const tokenPendingBalance = tokenPendingBalances?.[tokenType] || 0;
      tokenPendingValues[tokenType] = tokenPendingBalance * (prices[tokenType] ?? 0);
    });

    return userId
      ? {
          userId: userId,
          balance: tokenBalances,
          pendingBalance: tokenPendingBalances,
          value: tokenValues,
          pendingValue: tokenPendingValues,
        }
      : null;
  }, [balanceState.balance, pendingBalanceState.balance, prices]);

  return { status: balanceState.status, balance: balance };
};
