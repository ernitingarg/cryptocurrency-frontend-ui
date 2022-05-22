import { Box, Grid, Typography } from '@material-ui/core';
import React, { useMemo } from 'react';
import BorderedBox from 'src/components/atomic/Box/BorderedBox';
import { useNextInterestPaymentDate } from 'src/hooks/exchange/useNextInterestPaymentDate';
import { useBalance } from 'src/hooks/wallet/useBalance';
import { decimalAmount, floor, toFormatString } from 'src/lib/exchange/price';
import { TotalBalance } from 'src/types/blockchain/balance';
import { NativeToken, TokenType, tokenTypes } from 'src/types/blockchain/token';

const totalBalance = (balance: TotalBalance | null): number => {
  let sum: number = 0;
  if (balance) {
    tokenTypes.map((tokenType: TokenType) => {
      sum += (balance.value?.[tokenType] ?? 0) + (balance.pendingValue?.[tokenType] ?? 0);
    });
  }

  return sum;
};

const AccountOverview = () => {
  const { balance } = useBalance();
  const totalValue = useMemo(() => floor(totalBalance(balance), NativeToken), [balance]);

  // 今のところ年率は固定だが動的に変更できるように切り出したほうが良いか？
  const interestRatePerDay = 1 + 0.00026116;
  const apy = floor((Math.pow(interestRatePerDay, 365) - 1) * 100);
  const nextInterestPayment = useMemo(
    () =>
      balance?.balance?.[NativeToken]
        ? decimalAmount(balance.balance[NativeToken] * (interestRatePerDay - 1), NativeToken)
        : 0,
    [balance],
  );
  const [, nextDateString] = useNextInterestPaymentDate();

  return (
    <BorderedBox maxWidth={1132} mx="auto">
      <Typography variant="h2">Account Overview</Typography>
      <Box height={40} />
      <Grid container>
        <Grid item xs={12} sm={4}>
          <Box borderRight={1} borderColor="divider" minHeight={152} paddingTop={2}>
            <Typography variant="h3">Total Dollar Value of Crypto</Typography>
            <Typography fontSize={40} fontWeight="bold" component="span">
              {toFormatString(totalValue)}
            </Typography>
            <Typography fontSize={32} fontWeight="bold" component="span">
              &nbsp;USD
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box borderRight={1} borderColor="divider" minHeight={152} paddingLeft={5} paddingTop={2}>
            <Typography variant="h3">Annual Percentage Yield</Typography>
            <Typography fontSize={40} fontWeight="bold" component="span">
              {apy}
            </Typography>
            <Typography fontSize={32} fontWeight="bold" component="span">
              &nbsp;%
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box paddingLeft={5} minHeight={152}>
            <Typography variant="h3">Next Interest Payment（USDS）</Typography>
            <Typography fontSize={28} fontWeight="bold">
              {toFormatString(nextInterestPayment, NativeToken)} {NativeToken}
            </Typography>
            <Box height={26} />
            <Typography variant="h3">Next Interest Payment Date（Daily）</Typography>
            <Typography fontSize={28} fontWeight="bold">
              {nextDateString}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </BorderedBox>
  );
};

export default AccountOverview;
