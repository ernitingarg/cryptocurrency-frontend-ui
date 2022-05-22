import { useEffect, useState } from 'react';
import authClient from 'src/client/auth';

export const useAuthOnChanged = () => {
  const [uid, setUid] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  useEffect(() => {
    authClient.onAuthStateChanged((user) => {
      if (user) {
        setUid(user.uid);
        // user.getIdToken().then(console.log).catch(console.error);
      } else {
        setUid(null);
      }
      setIsChecked(true);
    });
  }, []);
  return [uid, isChecked];
};
