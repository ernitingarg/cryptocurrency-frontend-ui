import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import SigninForm from './SigninForm';

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
  changeSignup: () => void;
}

const SigninContent = ({ changeSignup }: Props) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Typography variant="h3">Login</Typography>
      <SigninForm className={classes.form} />
      <Link onClick={changeSignup}>Create new account</Link>
    </div>
  );
};

export default SigninContent;
