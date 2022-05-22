import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useSignin } from '../../../../hooks/auth/useSignCallback';
import { SigninFormInputs } from '../../../../types/form/login';
import SquareButton from '../../../atomic/Button/SquareButton';
import TextInput from '../../../atomic/Form/TextInput';

const useStyles = makeStyles((theme) => ({
  form: {
    '&>:nth-child(n)': {
      marginTop: theme.spacing(2),
    },
    '&>:first-child': {
      marginTop: 0,
    },
  },
  input: {
    textAlign: 'center',
    '&>:nth-child(n)': {
      margin: 'auto',
    },
  },
}));

interface Props {
  className?: string;
}

const SigninForm = ({ className }: Props) => {
  const classes = useStyles();
  const { handleSubmit, errors, control } = useForm<SigninFormInputs>();
  const signup = useSignin();
  const onSubmit = useMemo(() => handleSubmit((data) => signup(data.email, data.password)), [handleSubmit, signup]);
  return (
    <form className={clsx(classes.form, className)} onSubmit={onSubmit}>
      <Controller
        name="email"
        control={control}
        rules={{ required: true }}
        render={(props) => <TextInput {...props} size="medium" placeholder="email" name="email" required fullWidth />}
      />

      {errors.email && <Typography>required email</Typography>}
      <Controller
        name="password"
        control={control}
        rules={{ required: true }}
        render={(props) => (
          <TextInput {...props} type="password" size="medium" placeholder="password" name="password" required fullWidth />
        )}
      />
      {errors.password && <Typography>required password</Typography>}
      <SquareButton type="submit" variant="contained">
        Signin
      </SquareButton>
    </form>
  );
};

export default SigninForm;
