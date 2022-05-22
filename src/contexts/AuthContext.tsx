import React, { createContext, useMemo } from 'react';
import { useAuthOnChanged } from '../hooks/auth/useAuthOnChanged';
import { CircularProgress, Grid } from '@material-ui/core';

interface ContextValue {
  uid: string | null;
  isChecked: boolean;
}

const AuthContext = createContext<ContextValue>({ uid: null, isChecked: false });

const AuthContextProvider: React.FC = ({ children }) => {
  const [uid, isChecked] = useAuthOnChanged();
  const value = useMemo(
    () =>
      ({
        uid: uid,
        isChecked: isChecked,
      } as ContextValue),
    [uid, isChecked],
  );
  return (
    <AuthContext.Provider value={value}>
      {isChecked ? (
        children
      ) : (
        <Grid container justifyContent="center" direction="row" height="100vh">
          <Grid item my="auto">
            <CircularProgress />
          </Grid>
        </Grid>
      )}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthContextProvider };
