import {
  Box,
  CircularProgress,
  FormControl,
  Input,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useMemo, useState } from 'react';
import SquareButton from 'src/components/atomic/Button/SquareButton';
import CoinIcon from 'src/components/atomic/Icon/CoinIcon';
import { useFormalPrice } from 'src/hooks/exchange/useTokenPrice';
import { useWithdrawToken } from 'src/hooks/exchange/useWithdrawToken';
import { useBalance } from 'src/hooks/wallet/useBalance';
import { decimalAmount, toFormatString } from 'src/lib/exchange/price';
import { TokenType, tokenTypes } from 'src/types/blockchain/token';

interface WithdrawPanelProps {
  tokenType?: TokenType;
  onTransactionIsSuccessful?: () => void;
}

const useStyles = makeStyles(() => ({
  tabPanelButton: {
    padding: '14px 80px',
    textTransform: 'none',
    fontWeight: 'bold',
    fontSize: 18,
  },
}));

const WithdrawPanel = ({ ...props }: WithdrawPanelProps) => {
  const classes = useStyles();
  const [tokenType, setTokenType] = useState<TokenType>(props.tokenType ?? tokenTypes[0]);
  const balanceAll = useBalance();
  const balance = useFormalPrice(balanceAll.balance, tokenType);
  const withdrawToken = useWithdrawToken();
  const [amount, setAmount] = useState<number>();

  const amountErrorMessage = useMemo(() => {
    if (!amount) {
      return null;
    }
    const amountNumber = Number(amount);
    if (!isFinite(amountNumber)) {
      return 'Amount is not a number';
    }
    if (amountNumber != decimalAmount(amountNumber, tokenType)) {
      return 'Invalid amount';
    }
    if (amountNumber <= 0 || amountNumber > Number(balance)) {
      return 'Insufficient balance';
    }
    return null;
  }, [amount, tokenType, balance]);

  const [toAddress, setToAddress] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const disabled = !amount || !!amountErrorMessage || !toAddress || isSubmitting;

  const handleCoinChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setTokenType(event.target.value as TokenType);
  };

  const handleOnSubmit = () => {
    if (disabled) {
      return;
    }
    setIsSubmitting(true);
    withdrawToken(amount!, tokenType, toAddress!)
      .then(() => {
        setIsSubmitting(false);
        props.onTransactionIsSuccessful?.();
        return;
      })
      .catch((e) => {
        console.log(e);
        setIsSubmitting(false);
      });
  };

  return (
    <Box>
      <Typography mb={1} mt={4}>
        Coin
      </Typography>
      <Select value={tokenType} onChange={handleCoinChange}>
        {tokenTypes.map((tokenType: TokenType, index) => {
          return (
            <MenuItem value={tokenType} key={index}>
              <Box display="flex" flexDirection="row" height={44}>
                <Box height={20} my="auto" mr={1}>
                  <CoinIcon tokenType={tokenType as TokenType} />
                </Box>
                <Box height={20} my="auto" mr={9}>
                  {tokenType}
                </Box>
              </Box>
            </MenuItem>
          );
        })}
      </Select>

      <Typography mt={5} mb={1}>
        Withdraw Amount
      </Typography>
      <FormControl fullWidth>
        <InputLabel htmlFor="withdraw-amount">Amount</InputLabel>
        <Input
          name="amount"
          id="withdraw-amount"
          type="number"
          value={amount}
          onChange={({ target: { value } }) => {
            setAmount(Number(value));
          }}
          endAdornment={
            // eslint-disable-next-line react-perf/jsx-no-jsx-as-prop
            <InputAdornment position="end">
              <Typography fontSize={14}>{tokenType}</Typography>
            </InputAdornment>
          }
          inputProps={{
            'aria-label': 'weight',
            step: 0.01,
            min: 0,
          }}
          required
        />
      </FormControl>

      <Typography mt={1} mb={1} fontSize={14}>
        Balance: {toFormatString(balance, tokenType)} {tokenType}
      </Typography>
      {amountErrorMessage ? <Typography color="error">{amountErrorMessage}</Typography> : null}

      <Typography mt={5} mb={1}>
        {"Recipient's"} {tokenType} Address
      </Typography>
      <FormControl fullWidth>
        <InputLabel htmlFor="withdraw-address">{tokenType} Address</InputLabel>
        <Input
          name="toAddress"
          value={toAddress}
          onChange={({ target: { value } }) => setToAddress(value)}
          id="withdraw-address"
          inputProps={{
            'aria-label': 'weight',
          }}
          required
        />
      </FormControl>

      <Box mt={7} mx="auto" textAlign={'center'}>
        <SquareButton
          type="submit"
          variant="contained"
          className={classes.tabPanelButton}
          disabled={disabled}
          onClick={handleOnSubmit}
        >
          {isSubmitting ? <CircularProgress /> : 'Submit'}
        </SquareButton>
      </Box>
    </Box>
  );
};

export default WithdrawPanel;
