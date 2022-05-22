import { useRouter } from 'next/dist/client/router';
import { useEffect } from 'react';
import { useAuthContext } from './useAuthContext';

export const useEffectOnAuth = () => {
  const auth = useAuthContext();
  const router = useRouter();
  useEffect(() => {
    if (!auth.isChecked) {
      return;
    }
    if (auth.uid) {
      router.push('/');
    } else {
      router.push('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.uid]);
};
