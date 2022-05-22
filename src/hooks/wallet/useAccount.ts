import { useEffect, useReducer } from 'react';
import btcAccountRepository from 'src/repository/btcAccounts';
import ethAccountRepository from 'src/repository/ethAccounts';
import { Account } from 'src/types/blockchain/account';
import { BlockChainType } from 'src/types/blockchain/chain';
import { Status } from 'src/types/common/loading';
import { useAuthContext } from '../auth/useAuthContext';

type State = {
  status: Status;
  account: Account | null;
};

const initState: State = { status: 'initial', account: null };

type Action =
  | {
      type: 'setStatus';
      status: Status;
    }
  | {
      type: 'setAccount';
      account: Account | null;
    };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'setStatus':
      return {
        ...state,
        status: action.status,
      };
    case 'setAccount':
      return {
        ...state,
        status: 'loaded',
        account: action.account,
      };
    default:
      return state;
  }
};

export const useAccount = (type: BlockChainType) => {
  const [state, dispatch] = useReducer(reducer, initState);
  const { uid } = useAuthContext();
  useEffect(() => {
    if (!uid) {
      return;
    }
    let unsubscribe = () => {};
    switch (type) {
      case 'bitcoin':
        unsubscribe = btcAccountRepository.subscribe(uid, (account) => {
          dispatch({ type: 'setAccount', account });
        });
        break;
      case 'ethereum':
        unsubscribe = ethAccountRepository.subscribe(uid, (account) => {
          dispatch({ type: 'setAccount', account });
        });
        break;
      default:
        return;
    }

    return unsubscribe;
  }, [type, uid]);

  return state;
};
