import { Box, CircularProgress, FormControl, Input, Typography } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import React, { FormEvent, useState } from 'react';
import SquareButton from 'src/components/atomic/Button/SquareButton';
import { useSignin } from 'src/hooks/auth/useSignCallback';

const useStyles = makeStyles((_theme: Theme) => ({
  button: {
    padding: '14px 80px',
    textTransform: 'none',
    fontWeight: 'bold',
    fontSize: 18,
  },
}));

const SigninDialogContent = () => {
  const classes = useStyles();
  const signIn = useSignin();

  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const disabled = !email || !password;
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleOnSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (disabled) {
      return;
    }
    setIsSubmitting(true);
    signIn(email as string, password as string)
      .then(() => {
        setIsSubmitting(false);
        return;
      })
      .catch((e: Error) => {
        console.log(e);
        setErrorMessage(e.message);
        setIsSubmitting(false);
      });
  };

  return (
    <Box>
      <form onSubmit={handleOnSubmit}>
        <Typography variant="h2" mb={2.5} fontWeight="bold">
          Log In
        </Typography>
        {errorMessage ? (
          <Typography my={0.5} fontSize={12} color="warning.main" fontWeight="bold">
            {errorMessage}
          </Typography>
        ) : null}
        <Typography mt={2.5} mb={1}>
          Email
        </Typography>
        <FormControl fullWidth>
          <Input
            type="email"
            name="email"
            value={email}
            onChange={({ target: { value } }) => setEmail(value)}
            id="email"
            inputProps={{
              'aria-label': 'weight',
            }}
            required
          />
        </FormControl>

        <Typography mt={5}>Password</Typography>
        <FormControl fullWidth>
          <Input
            type="password"
            name="password"
            value={password}
            onChange={({ target: { value } }) => setPassword(value)}
            id="password"
            inputProps={{
              'aria-label': 'weight',
            }}
            required
          />
        </FormControl>

        <Box mt={7} mx="auto" textAlign={'center'}>
          <SquareButton type="submit" variant="contained" className={classes.button} disabled={disabled}>
            {isSubmitting ? <CircularProgress /> : 'Log In'}
          </SquareButton>
        </Box>
      </form>
    </Box>
  );
};

export default SigninDialogContent;
