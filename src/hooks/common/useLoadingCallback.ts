import { useCallback, useReducer } from 'react';
import { Status } from 'src/types/common/loading';

type State = {
  status: Status;
};

type Action = {
  type: 'setStatus';
  status: Status;
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'setStatus':
      return {
        ...state,
        status: action.status,
      };
    default:
      return state;
  }
};

export const useLoadingCallback = <Args, Return>(callback: (args: Args) => Return) => {
  const [state, dispatch] = useReducer(reducer, { status: 'initial' });
  const fn = useCallback(
    async (args: Args) => {
      dispatch({ type: 'setStatus', status: 'loading' });
      const result = await callback(args);
      dispatch({ type: 'setStatus', status: 'loaded' });
      return result;
    },
    [callback],
  );
  return {
    callback: fn,
    state,
  };
};
