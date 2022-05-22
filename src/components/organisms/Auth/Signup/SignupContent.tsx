import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import SignupForm from './SignupForm';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  form: {
    maxWidth: 600,
    margin: 'auto',
    textAlign: 'center',
  },
}));

interface Props {
  changeSignin: () => void;
}

const SigninContent = ({ changeSignin }: Props) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Typography variant="h3">Register</Typography>
      <SignupForm className={classes.form} />
      <Link onClick={changeSignin}>Already have an account</Link>
    </div>
  );
};

export default SigninContent;
