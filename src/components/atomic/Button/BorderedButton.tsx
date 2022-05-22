import Button, { ButtonProps } from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import React from 'react';

const useStyles = makeStyles(() => ({
  borderedButton: () => ({
    borderRadius: '2px',
    padding: '8px 35px',
  }),
}));

const BorderedButton = ({ className, ...props }: ButtonProps) => {
  const classes = useStyles();
  const customClassName = clsx(classes.borderedButton, className);
  return <Button className={customClassName} disableElevation variant="outlined" color="secondary" {...props} />;
};

export default BorderedButton;
