import MuiLink, { LinkProps as MuiLinkProps } from '@material-ui/core/Link';
import Link, { LinkProps } from 'next/link';

interface Props extends LinkProps, Omit<MuiLinkProps, 'href'> {}

const NextLink = ({ children, href, as, replace, shallow, passHref, prefetch, ...props }: Props) => {
  return (
    <Link {...{ href, as, replace, shallow, passHref, prefetch }}>
      <MuiLink {...props}>{children}</MuiLink>
    </Link>
  );
};

export default NextLink;
