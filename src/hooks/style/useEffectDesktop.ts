import { useEffect } from 'react';
import { useIsDesktop } from './useIsDesktop';

export const useEffectDesktop = (option: {
  onEffect?: (isDesktop?: boolean) => void | Promise<void>;
  offEffect?: (isDesktop?: boolean) => void | Promise<void>;
}) => {
  const isDesktop = useIsDesktop();
  useEffect(() => {
    if (option.onEffect) {
      option.onEffect(isDesktop);
    }

    return () => {
      if (option.offEffect) {
        option.offEffect(isDesktop);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDesktop]);
};
