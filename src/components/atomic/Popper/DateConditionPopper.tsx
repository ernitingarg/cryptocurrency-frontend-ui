import { Box, Button, ClickAwayListener, Popper, Typography } from '@material-ui/core';
import React, { useEffect } from 'react';
import BorderedBox from 'src/components/atomic/Box/BorderedBox';
import SquareButton from 'src/components/atomic/Button/SquareButton';
import { makeStyles } from '@material-ui/core/styles';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DayjsUtils from '@date-io/dayjs';
import dayjs from 'dayjs';
import { ButtonProps } from '@material-ui/core/Button';

const useStyles = makeStyles(() => ({
  popperButton: {
    textTransform: 'none',
  },
  applyButton: {
    padding: '12px 40px',
    textTransform: 'none',
    fontWeight: 'bold',
    fontSize: 18,
  },
}));

interface DateConditionButtonProps extends ButtonProps {
  onApply: (fromDate: dayjs.Dayjs | null, toDate: dayjs.Dayjs | null) => void;
}

const DateConditionButton = ({ ...props }: DateConditionButtonProps) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [isOpen, setIsOpen] = React.useState(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setIsOpen(!isOpen);
  };

  const handleOnApply = (fromDate: dayjs.Dayjs | null, toDate: dayjs.Dayjs | null) => {
    props.onApply(fromDate, toDate);
    setIsOpen(false);
  };

  return (
    <>
      <Button onClick={handleClick}>
        <Typography color="success.main" className={classes.popperButton}>
          Date
        </Typography>
      </Button>
      <DateConditionPopper
        isOpen={isOpen}
        anchorEl={anchorEl}
        onApply={handleOnApply}
        onClickAway={() => setIsOpen(false)}
      />
    </>
  );
};

interface DateConditionPopperProps {
  isOpen: boolean;
  anchorEl: HTMLButtonElement | null;
  onApply: (fromDate: dayjs.Dayjs | null, toDate: dayjs.Dayjs | null) => void;
  onClickAway: () => void;
}

const DateConditionPopper = ({ ...props }: DateConditionPopperProps) => {
  const classes = useStyles();
  const [isOpen, setIsOpen] = React.useState<boolean>(props.isOpen);
  const [fromDate, setFromDate] = React.useState<dayjs.Dayjs | null>(null);
  const [toDate, setToDate] = React.useState<dayjs.Dayjs | null>(null);

  useEffect(() => setIsOpen(props.isOpen), [props.isOpen]);

  const handleOnApply = (_event: React.MouseEvent) => {
    props.onApply(fromDate, toDate);
    setIsOpen(false);
  };

  const handleOnClickAway = (_event: MouseEvent | TouchEvent) => {
    props.onClickAway();
    setIsOpen(false);
  };

  return (
    <ClickAwayListener onClickAway={handleOnClickAway}>
      <Popper open={isOpen} anchorEl={props.anchorEl} placement="bottom-end">
        <MuiPickersUtilsProvider utils={DayjsUtils}>
          <BorderedBox bgcolor="grey.100" width={340} p={5}>
            <Typography mb={1}>From</Typography>
            <KeyboardDatePicker
              fullWidth
              disableToolbar
              variant="inline"
              inputVariant="standard"
              format="YYYY-MM-DD"
              margin="normal"
              autoOk
              allowKeyboardControl={false}
              value={fromDate}
              onChange={setFromDate}
            />

            <Typography mt={5} mb={1}>
              To
            </Typography>
            <KeyboardDatePicker
              fullWidth
              disableToolbar
              variant="inline"
              inputVariant="standard"
              format="YYYY-MM-DD"
              margin="normal"
              autoOk
              allowKeyboardControl={false}
              value={toDate}
              onChange={setToDate}
            />
            <Box mt={5} mx="auto" textAlign="center">
              <SquareButton variant="contained" className={classes.applyButton} onClick={handleOnApply}>
                Apply
              </SquareButton>
            </Box>
          </BorderedBox>
        </MuiPickersUtilsProvider>
      </Popper>
    </ClickAwayListener>
  );
};

export { DateConditionButton, DateConditionPopper };
