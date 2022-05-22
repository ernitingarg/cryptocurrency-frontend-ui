import { Box, Link, Typography } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { NextPage } from 'next';
import React, { useState } from 'react';
import SigninDialogContent from 'src/components/organisms/Auth/Signin/SigninDialog';
import SignupDialogContent from 'src/components/organisms/Auth/Signup/SignupDialog';

const useStyles = makeStyles((_theme: Theme) => ({
  dialogContent: {
    padding: 0,
  },
}));

const Signin: NextPage = () => {
  const classes = useStyles();

  const [isLoginMode, setIsLoginMode] = useState<boolean>(true);

  return (
    <Box bgcolor="primary.main" height="100vh" width="100%">
      <Box pl={3} pt={3}>
        <img src="/logo.svg" alt="soteria logo" />
      </Box>
      <Dialog open={true}>
        <DialogContent className={classes.dialogContent}>
          <Box p={5} pt={2.5} width={480}>
            {isLoginMode ? (
              <>
                <SigninDialogContent />
                <Box mx="auto" textAlign="center">
                  <Typography mt={4} fontSize={13}>
                    <Link href="#" color="success.main" onClick={() => setIsLoginMode(false)}>
                      Register
                    </Link>
                  </Typography>
                </Box>
              </>
            ) : (
              <>
                <SignupDialogContent />
                <Box mx="auto" textAlign="center">
                  <Typography mt={4} fontSize={13}>
                    <Link href="#" color="success.main" onClick={() => setIsLoginMode(true)}>
                      Log in
                    </Link>
                  </Typography>
                </Box>
              </>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Signin;
