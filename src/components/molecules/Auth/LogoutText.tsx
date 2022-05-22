import Link, { LinkProps } from '@material-ui/core/Link';
import { useSignout } from '../../../hooks/auth/useSignCallback';

type Props = Omit<LinkProps, 'href' | 'onClick'>;

const LogoutText = (props: Props) => {
  const signout = useSignout();
  return (
    <Link {...props} onClick={signout}>
      LOGOUT
    </Link>
  );
};

export default LogoutText;
