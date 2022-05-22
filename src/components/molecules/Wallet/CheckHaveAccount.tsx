import { useEffect } from 'react';
import { useAccount } from 'src/hooks/wallet/useAccount';
import { useRouter } from 'next/dist/client/router';
import { useAuthContext } from 'src/hooks/auth/useAuthContext';

const CheckHaveAccount = ({ ...props }) => {
  const router = useRouter();
  const auth = useAuthContext();
  const btcAccount = useAccount('bitcoin');
  const ethAccount = useAccount('ethereum');

  useEffect(() => {
    if (!auth.uid || btcAccount.status !== 'loaded' || ethAccount.status !== 'loaded') {
      return;
    }
    if (!btcAccount.account || !ethAccount.account) {
      router.push('/create_account');
    }
  }, [auth, btcAccount, ethAccount]);

  return props.children;
};

export default CheckHaveAccount;
