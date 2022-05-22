import { Box, CircularProgress, FormControl, Grid, Input, MenuItem, Select, Typography } from '@material-ui/core';
import { SelectInputProps } from '@material-ui/core/Select/SelectInput';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useMemo, useState } from 'react';
import SquareButton from 'src/components/atomic/Button/SquareButton';
import CoinIcon from 'src/components/atomic/Icon/CoinIcon';
import { useConversionFeeRate } from 'src/hooks/exchange/useConversionFeeRate';
import { useConvertToken } from 'src/hooks/exchange/useConvertToken';
import { calculateToAmount, useRequiredTokenTypes } from 'src/hooks/exchange/useConvertUtil';
import { useLastPrice } from 'src/hooks/exchange/useLastPrice';
import { useBalance } from 'src/hooks/wallet/useBalance';
import { decimalAmount, floor, toFixed, toFormatString } from 'src/lib/exchange/price';
import { TotalBalance } from 'src/types/blockchain/balance';
import { NativeToken, stableTokenTypes, TokenPair, TokenType, tokenTypes } from 'src/types/blockchain/token';

interface ConvertPanelProps {
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

interface SelectCoinProps {
  fromValue?: TokenType;
  value: TokenType;
  onSelect: SelectInputProps<TokenType>['onChange'];
}

const SelectCoin = ({ ...props }: SelectCoinProps) => {
  return (
    <Select value={props.value} onChange={props.onSelect}>
      {useRequiredTokenTypes(props.fromValue).map((tokenType: TokenType, index: any) => {
        return (
          <MenuItem value={tokenType} key={index}>
            <Box display="flex" flexDirection="row" height={44} width={110}>
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
  );
};

const useConversionPrice = (
  lastPrice: number | undefined,
  feeRate: number | undefined,
  fromType: TokenType,
  toType: TokenType,
) => {
  return useMemo(() => {
    if (!feeRate || !lastPrice) {
      return;
    }

    // fromType == usdsの場合は↓のようになる
    // const amount (BTC) = fromToken * rate
    // = fromToken * (1 / rawPrice)
    // = fromToken * (1 / (lastPrice * (1/(1-feeRate))))
    // = fromToken * (1 / lastPrice) * (1-feeRate)
    // fromToken * (1 / lastPrice): 手数料がかからない場合のamount（BTC）
    // (1-feeRate): 手数料分引いている

    const rawPrice = fromType !== NativeToken ? lastPrice * (1 - feeRate) : lastPrice / (1 - feeRate);

    // In case when both are stable coins, don't perform floor
    return stableTokenTypes.includes(fromType) && stableTokenTypes.includes(toType) ? lastPrice : Math.floor(rawPrice);
  }, [feeRate, fromType, lastPrice]);
};

const isValidBalance = (amount: number, tokenType: TokenType, balance: TotalBalance | null): boolean => {
  if (!amount || !balance) {
    return true;
  }

  const compare = balance?.balance?.[tokenType];
  if (amount <= 0 || amount > Number(compare)) {
    return false;
  }
  return true;
};

const ConvertPanel = ({ ...props }: ConvertPanelProps) => {
  const classes = useStyles();
  const convertToken = useConvertToken();
  const fromToken = props.tokenType ?? tokenTypes[0];
  const [fromTokenType, setFromTokenType] = useState<TokenType>(fromToken);
  const [toTokenType, setToTokenType] = useState<TokenType>(
    useRequiredTokenTypes(fromToken).find((t: TokenType) => t != null) as TokenType,
  );

  const tokenPair = `${fromTokenType === NativeToken ? toTokenType : fromTokenType}-USD` as TokenPair;
  const [lastPrice] = useLastPrice(tokenPair);
  const { data: feeRatePerFrom } = useConversionFeeRate(fromTokenType, toTokenType);
  const conversionPrice = useConversionPrice(lastPrice, feeRatePerFrom, fromTokenType, toTokenType);

  const balance = useBalance();
  const [fromAmount, setFromAmount] = useState<string>();
  const fromAmountErrorMessage = useMemo<string | null>(() => {
    if (!fromAmount) {
      return null;
    }
    const amountNumber = Number(fromAmount);
    if (!isFinite(amountNumber)) {
      return 'Amount is not a number';
    }
    if (amountNumber != decimalAmount(amountNumber, fromTokenType)) {
      return 'Invalid amount';
    }
    if (!isValidBalance(amountNumber, fromTokenType, balance.balance)) {
      return 'Insufficient balance';
    }
    return null;
  }, [fromAmount, fromTokenType, balance]);

  const calculateFromAmount = (toAmount: string): number | null => {
    if (!conversionPrice || !toAmount || !isFinite(Number(toAmount))) {
      return null;
    }
    const rate = toTokenType !== NativeToken ? conversionPrice : 1.0 / conversionPrice;
    return decimalAmount(Number(toAmount) / (1 / rate), fromTokenType);
  };

  const [toAmount, setToAmount] = useState<string>();
  const toAmountErrorMessage = useMemo<string | null>(() => {
    if (!toAmount) {
      return null;
    }
    const amountNumber = Number(toAmount);
    if (!isFinite(amountNumber)) {
      return 'Amount is not a number';
    }
    if (amountNumber != decimalAmount(amountNumber, toTokenType)) {
      return 'Invalid amount';
    }
    if (
      Number(fromAmount) !== calculateFromAmount(toAmount) &&
      amountNumber !== calculateToAmount(Number(fromAmount), fromTokenType, conversionPrice, toTokenType)
    ) {
      return 'Invalid amount';
    }
    return null;
  }, [fromAmount, conversionPrice, toAmount]);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const disabled =
    !conversionPrice || !fromAmount || !!fromAmountErrorMessage || !toAmount || !!toAmountErrorMessage || isSubmitting;

  const handleFromCoinChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedTokenType = event.target.value as TokenType;
    setFromTokenType(selectedTokenType);
    setToTokenType(useRequiredTokenTypes(selectedTokenType).find((t: TokenType) => t != null) as TokenType);
    setFromAmount('');
    setToAmount('');
  };

  const handleToCoinChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedTokenType = event.target.value as TokenType;
    setToTokenType(selectedTokenType);

    const toAmount = calculateToAmount(Number(fromAmount), fromTokenType, conversionPrice, toTokenType);
    if (toAmount) {
      setToAmount(toFixed(toAmount, toTokenType));
    } else {
      setToAmount('');
    }
  };

  const handleFromAmountChange = (event: React.ChangeEvent<{ value: string }>) => {
    setFromAmount(event.target.value);
    const toAmount = calculateToAmount(Number(event.target.value), fromTokenType, conversionPrice, toTokenType);
    if (toAmount) {
      setToAmount(toFixed(toAmount, toTokenType));
    }
  };

  const handleToAmountChange = (event: React.ChangeEvent<{ value: string }>) => {
    setToAmount(event.target.value);
    const fromAmount = calculateFromAmount(event.target.value);
    if (fromAmount) {
      setFromAmount(toFixed(fromAmount, fromTokenType));
    }
  };

  const handleOnSubmit = () => {
    if (disabled) {
      return;
    }
    setIsSubmitting(true);
    convertToken(Number(fromAmount), fromTokenType, toTokenType, Number(conversionPrice))
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

  useEffect(() => {
    const result = calculateToAmount(Number(fromAmount), fromTokenType, conversionPrice, toTokenType);
    if (result) {
      setToAmount(toFixed(result, toTokenType));
    }
  }, [conversionPrice]);

  return (
    <Box>
      <Typography mb={1} mt={4}>
        From
      </Typography>
      <Box display="flex" flexDirection="row" justifyContent="space-between" height={44}>
        <Box mx={'auto'} mt={'auto'} width="100%">
          <FormControl fullWidth>
            <Input
              name="from-amount"
              id="convert-from-amount"
              type="number"
              placeholder="Please enter amount"
              value={fromAmount}
              onChange={handleFromAmountChange}
              required
              inputProps={{
                step: 0.01,
                min: '0',
              }}
            />
          </FormControl>
        </Box>
        <Box width={16} />
        <SelectCoin value={fromTokenType} onSelect={handleFromCoinChange} />
      </Box>
      {fromAmountErrorMessage ? <Typography color="error">{fromAmountErrorMessage}</Typography> : null}
      <Typography mt={5} mb={1}>
        To
      </Typography>
      <Box display="flex" flexDirection="row" justifyContent="space-between" height={44}>
        <Box mx={'auto'} mt={'auto'} width="100%">
          <FormControl fullWidth>
            <Input
              name="to-amount"
              id="convert-to-amount"
              type="number"
              placeholder="Please enter amount"
              value={toAmount}
              onChange={handleToAmountChange}
              required
              inputProps={{
                step: 0.01,
                min: '0',
              }}
            />
          </FormControl>
        </Box>
        <Box width={16} />
        <SelectCoin fromValue={fromTokenType} value={toTokenType} onSelect={handleToCoinChange} />
      </Box>
      {toAmountErrorMessage ? <Typography color="error">{toAmountErrorMessage}</Typography> : null}
      <Box mt={7} py={2} px={3} bgcolor="grey.100">
        <Typography fontSize={14} mb={1}>
          Balance
        </Typography>
        <Grid container>
          {tokenTypes.map((tokenType: TokenType) => {
            return (
              <Grid item xs={6} m={'auto'}>
                <Box display="flex" flexDirection="row">
                  <CoinIcon tokenType={tokenType} />
                  <Box ml={1}>
                    <Typography fontSize={14}>
                      {toFormatString(balance.balance?.balance?.[tokenType] ?? 0, tokenType)} {tokenType}
                    </Typography>
                    <Typography fontSize={12} color="grey.500">
                      {toFormatString(floor(balance.balance?.value?.[tokenType] ?? 0))} USD
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Box>
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

export default ConvertPanel;
