import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { AppProps } from 'next/app';
import * as React from 'react';
import 'react-pro-sidebar/dist/css/styles.css';
import AuthEffect from 'src/components/molecules/Auth/AuthEffect';
import { AuthContextProvider } from 'src/contexts/AuthContext';
import CheckHaveAccount from 'src/components/molecules/Wallet/CheckHaveAccount';

const theme = createMuiTheme({
  typography: {
    fontFamily: 'HelveticaNeue, Helvetica, Arial',
    fontSize: 16,
    h2: {
      fontSize: 26,
    },
    h3: {
      fontSize: 14,
      color: '#9BA8B0',
    },
  },
  palette: {
    primary: {
      main: '#1E2326',
    },
    secondary: {
      main: '#E3E6E8',
    },
    success: {
      main: '#4DAE20',
    },
    warning: {
      main: '#D85252',
    },
    text: {
      primary: '#1E2326',
      secondary: '#9BA8B0',
    },
    divider: '#E3E6E8',
    grey: {},
  },
  components: {
    MuiLink: {
      styleOverrides: {
        root: {
          cursor: 'pointer',
        },
      },
    },
  },
});

const RootApp = ({ Component, pageProps }: AppProps) => {
  return (
    <ThemeProvider theme={theme}>
      <AuthContextProvider>
        <CssBaseline />
        <AuthEffect />
        <CheckHaveAccount>
          <Component {...pageProps} />
        </CheckHaveAccount>
      </AuthContextProvider>
    </ThemeProvider>
  );
};

export default RootApp;
