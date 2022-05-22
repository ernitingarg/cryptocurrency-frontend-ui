import { useCallback } from 'react';
import authClient from 'src/client/auth';

export const useSignup = () => {
  return useCallback(async (email: string, password: string) => {
    await authClient.createUserWithEmailAndPassword(email, password);
  }, []);
};

export const useSignout = () => {
  return useCallback(async () => {
    await authClient.signOut();
  }, []);
};

export const useSignin = () => {
  return useCallback(async (email: string, password: string) => {
    await authClient.signInWithEmailAndPassword(email, password);
  }, []);
};
