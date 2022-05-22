import { useAuthContext } from '../../../hooks/auth/useAuthContext';

interface Props {
  fallback?: React.ReactNode;
  children?: React.ReactNode;
}

const WithLoggedIn = ({ children = null, fallback = null }: Props) => {
  const auth = useAuthContext();
  return (
    <>
      {auth.uid && children}
      {!auth.uid && fallback}
    </>
  );
};

export default WithLoggedIn;
