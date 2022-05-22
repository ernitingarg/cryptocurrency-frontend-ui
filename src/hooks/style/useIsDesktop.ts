import { Theme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

export const useIsDesktop = () => {
  return useMediaQuery((theme: Theme) => theme.breakpoints.up('xs'));
};
