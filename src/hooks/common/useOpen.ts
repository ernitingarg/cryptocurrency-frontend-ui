import { useCallback, useState } from 'react';

export const useOpen = (init?: boolean): [boolean, { onOpen: () => void; onClose: () => void }] => {
  const [open, setOepn] = useState<boolean>(!!init);
  const onOpen = useCallback(() => {
    setOepn(true);
  }, []);
  const onClose = useCallback(() => {
    setOepn(false);
  }, []);
  return [open, { onOpen, onClose }];
};
