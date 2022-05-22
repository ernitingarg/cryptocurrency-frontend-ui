import { Box, Checkbox, CircularProgress, FormControl, Input, Link, Typography } from '@material-ui/core';
import SquareButton from 'src/components/atomic/Button/SquareButton';
import React, { useState } from 'react';
import { useSignup } from 'src/hooks/auth/useSignCallback';
import { makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((_theme: Theme) => ({
  button: {
    padding: '14px 80px',
    textTransform: 'none',
    fontWeight: 'bold',
    fontSize: 18,
  },
}));

const SignupDialogContent = () => {
  const classes = useStyles();
  const signUp = useSignup();

  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [isAgree, setIsAgree] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const disabled = !email || !password || !isAgree;
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleIsAgreeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsAgree(event.target.checked);
  };

  const handleOnSubmit = () => {
    if (disabled) {
      return;
    }
    setIsSubmitting(true);
    signUp(email as string, password as string)
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
      <Typography variant="h2" mb={2.5} fontWeight="bold">
        Register
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

      <Box mt={4} display="flex" flexDirection="row">
        <Box my="auto">
          <Checkbox checked={isAgree} color="primary" onChange={handleIsAgreeChange} />
        </Box>
        <Box my="auto" lineHeight={1}>
          <Typography display="inline" fontSize={12}>
            {'I accept the '}
          </Typography>
          <Typography display="inline" fontSize={12}>
            <Link href="https://www.soteriacurrency.com/terms-and-services" color="success.main" target="_blank">
              Terms of Service
            </Link>
          </Typography>
          <Typography display="inline" fontSize={12}>
            {' and I understand the '}
          </Typography>
          <Typography display="inline" fontSize={12}>
            <Link href="https://www.soteriacurrency.com/privacy-agreement" color="success.main" target="_blank">
              Privacy Policy
            </Link>
          </Typography>
          <Typography display="inline" fontSize={12}>
            {' and '}
          </Typography>
          <Typography display="inline" fontSize={12}>
            <Link href="https://www.soteriacurrency.com/risk-disclosure" color="success.main" target="_blank">
              Risk Disclosure
            </Link>
          </Typography>
          <Typography display="inline" fontSize={12}>
            {'.'}
          </Typography>
        </Box>
      </Box>

      <Box mt={5} mx="auto" textAlign={'center'}>
        <SquareButton
          type="submit"
          variant="contained"
          className={classes.button}
          disabled={disabled}
          onClick={handleOnSubmit}
        >
          {isSubmitting ? <CircularProgress /> : 'Register'}
        </SquareButton>
      </Box>
    </Box>
  );
};

export default SignupDialogContent;
