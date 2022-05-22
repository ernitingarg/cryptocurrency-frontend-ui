import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import { ReactElement, useCallback } from 'react';
import { useOpen } from '../common/useOpen';

interface Param {
  initOpen: boolean;
}

interface Value {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}

interface RenderProps {
  children: ReactElement;
  title?: string;
}

export const useModal = (params?: Param): [Value, (props: RenderProps) => JSX.Element] => {
  const [open, { onOpen, onClose }] = useOpen(params?.initOpen);

  const renderModal = useCallback(
    (props: RenderProps) => (
      <Dialog open={open} onClose={onClose}>
        {props?.title && <DialogTitle>{props?.title}</DialogTitle>}
        {props.children}
      </Dialog>
    ),
    [onClose, open],
  );

  return [{ open, onOpen, onClose }, renderModal];
};
