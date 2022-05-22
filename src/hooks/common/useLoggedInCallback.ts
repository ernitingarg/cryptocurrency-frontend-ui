import { useCallback } from 'react';
import { useAuthContext } from '../auth/useAuthContext';

export const useLoggedInCallback = <Args, Return>(callback: (args: Args) => Return) => {
  const uid = useAuthContext();
  const fn = useCallback(
    (args: Args) => {
      if (!uid) {
        return;
      }
      return callback(args);
    },
    [callback, uid],
  );
  return { callback: fn, isLoggedIn: !!uid };
};
