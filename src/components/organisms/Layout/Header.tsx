import { AppBar, Link, Snackbar, Toolbar } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import NextLink from '../../molecules/Text/NextLink';
import WithLoggedIn from '../../molecules/With/WithLoggedIn';
import { useSignout } from 'src/hooks/auth/useSignCallback';
import { useModal } from 'src/hooks/modal/useModal';
import DialogContent from '@material-ui/core/DialogContent';
import React, { useState } from 'react';
import ExchangeDialog, { ExchangeDialogTab } from 'src/components/organisms/Exchange/ExchangeDialog';

const useStyles = makeStyles((theme: Theme) => ({
  menuButton: {
    marginRight: theme.spacing(8),
    color: 'white',
  },
  title: {
    flexGrow: 1,
  },
}));

const Login = (
  <NextLink href="/login" color="inherit" variant="button">
    Login
  </NextLink>
);

const Header = () => {
  const classes = useStyles();
  const signOut = useSignout();
  const [{ onOpen, onClose }, renderModal] = useModal();
  const [tab, setTab] = useState<ExchangeDialogTab>();
  const [isOpenSnackbar, setIsOpenSnackbar] = useState<boolean>(false);

  const onOpenExchangeDialog = (tab: ExchangeDialogTab) => {
    return () => {
      setTab(tab);
      onOpen();
    };
  };

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <NextLink href="/" variant="h6" className={classes.title}>
            <img src="/logo.svg" alt="soteria logo" />
          </NextLink>
          <WithLoggedIn fallback={Login}>
            <Link onClick={onOpenExchangeDialog(ExchangeDialogTab.deposit)} className={classes.menuButton}>
              Deposit
            </Link>
            <Link onClick={onOpenExchangeDialog(ExchangeDialogTab.withdraw)} className={classes.menuButton}>
              Withdraw
            </Link>
            <Link onClick={onOpenExchangeDialog(ExchangeDialogTab.convert)} className={classes.menuButton}>
              Convert
            </Link>
            <Link onClick={signOut} className={classes.menuButton}>
              Log Out
            </Link>
          </WithLoggedIn>
          {renderModal({
            children: (
              <DialogContent>
                <ExchangeDialog
                  defaultTab={tab}
                  onTransactionIsSuccessful={() => {
                    onClose();
                    setIsOpenSnackbar(true);
                    setTimeout(() => setIsOpenSnackbar(false), 3000);
                  }}
                />
              </DialogContent>
            ),
          })}
          <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            open={isOpenSnackbar}
            message="Successful"
          />
        </Toolbar>
      </AppBar>
      {/* refs: https://material-ui.com/components/app-bar/#fixed-placement */}
      <Toolbar />
    </>
  );
};

export default Header;
