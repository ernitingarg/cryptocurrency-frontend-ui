import { Box, BoxProps } from '@material-ui/core';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  borderedBox: () => ({
    border: '1px solid',
    borderColor: theme.palette.divider,
    boxSizing: 'border-box',
    borderRadius: '4px',
    padding: '24px 40px',
  }),
}));

const BorderedBox = ({ className, ...props }: BoxProps) => {
  const classes = useStyles(props);
  const customClassName = clsx(classes.borderedBox, className);
  return <Box className={customClassName} {...props} />;
};

export default BorderedBox;
