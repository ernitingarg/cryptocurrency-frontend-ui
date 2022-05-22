import { NextPage } from 'next';
import React, { useState } from 'react';
import { Box, CircularProgress, Typography } from '@material-ui/core';
import DialogContent from '@material-ui/core/DialogContent';
import Dialog from '@material-ui/core/Dialog';
import { makeStyles, Theme } from '@material-ui/core/styles';
import SquareButton from 'src/components/atomic/Button/SquareButton';
import { useAccount } from 'src/hooks/wallet/useAccount';
import { useCreateAddress } from 'src/hooks/wallet/useCreateAddress';
import { useRouter } from 'next/dist/client/router';

const useStyles = makeStyles((_theme: Theme) => ({
  dialogContent: {
    padding: 0,
  },
  button: {
    padding: '14px 80px',
    textTransform: 'none',
    fontWeight: 'bold',
    fontSize: 18,
  },
}));

const CreateAccount: NextPage = () => {
  const router = useRouter();

  const classes = useStyles();
  const btcAccount = useAccount('bitcoin');
  const ethAccount = useAccount('ethereum');
  const createBtcAddress = useCreateAddress('bitcoin');
  const createEthAddress = useCreateAddress('ethereum');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const isAlreadyCreatedMessage =
    !!btcAccount.account && !!ethAccount.account ? 'The accounts have already been created.' : null;
  const disabled = isSubmitting || !!isAlreadyCreatedMessage;
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleOnSubmit = () => {
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    const createAddressPromises = [];
    if (!btcAccount.account) {
      createAddressPromises.push(createBtcAddress());
    }
    if (!ethAccount.account) {
      createAddressPromises.push(createEthAddress());
    }

    Promise.all(createAddressPromises)
      .then(() => {
        setIsSubmitting(false);
        router.push('/');
        return;
      })
      .catch((e: Error) => {
        console.log(e);
        setErrorMessage(e.message);
        setIsSubmitting(false);
      });
  };

  return (
    <Box bgcolor="primary.main" height="100vh" width="100%">
      <Box pl={3} pt={3}>
        <img src="/logo.svg" alt="soteria logo" />
      </Box>
      <Dialog open={true}>
        <DialogContent className={classes.dialogContent}>
          <Box p={5} pt={2.5} width={480}>
            <Typography variant="h2" mb={2.5} fontWeight="bold">
              Welcome to Soteria
            </Typography>
            <Typography fontSize={14}>
              In order to use Soteria, you need to create a Bitcoin and Ethereum address. Please click the button below
              to create the address.
            </Typography>
            <Box mt={5} mx="auto" textAlign={'center'}>
              <SquareButton
                type="submit"
                variant="contained"
                className={classes.button}
                disabled={disabled}
                onClick={handleOnSubmit}
              >
                {isSubmitting ? <CircularProgress /> : 'Create Address'}
              </SquareButton>
            </Box>
            {isAlreadyCreatedMessage ? (
              <Box mx="auto" mt={2} textAlign="center">
                <Typography my={0.5} fontSize={12} color="warning.main" fontWeight="bold">
                  {isAlreadyCreatedMessage}
                </Typography>
              </Box>
            ) : null}
            {errorMessage ? (
              <Box mx="auto" mt={2} textAlign="center">
                <Typography my={0.5} fontSize={12} color="warning.main" fontWeight="bold">
                  {errorMessage}
                </Typography>
              </Box>
            ) : null}
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default CreateAccount;
