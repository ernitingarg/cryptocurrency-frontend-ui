import Button, { ButtonProps } from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

interface StylesProps {
  exLarge?: boolean;
}
const useStyles = makeStyles(() => ({
  roundButton: ({ exLarge }: StylesProps) => ({
    borderRadius: '4px',
    height: exLarge ? '50px' : undefined,
  }),
}));

export type Props = ButtonProps & StylesProps;

const SquareButton = ({ className, exLarge, ...props }: Props) => {
  const classes = useStyles({ exLarge });
  const customClassName = clsx(classes.roundButton, className);
  return <Button className={customClassName} disableElevation {...props} />;
};

export default SquareButton;
