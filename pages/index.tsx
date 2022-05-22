import { Box } from '@material-ui/core';
import React from 'react';
import { NextPage } from 'next';
import Balances from 'src/components/organisms/Exchange/Balances';
import Markets from 'src/components/organisms/Exchange/Markets';
import { ConvertHistoryTableBox } from 'src/components/organisms/Exchange/ConvertHistories';
import AccountOverview from 'src/components/organisms/Exchange/AccountOverview';
import InterestPaymentHistoryBox from 'src/components/organisms/Exchange/InterestPaymentHistories';
import DepositHistoryBox from 'src/components/organisms/Exchange/DepositHistories';
import WithdrawHistoryBox from 'src/components/organisms/Exchange/WithdrawHistories';
import Layout from 'src/components/organisms/Layout/Layout';

const Index: NextPage = () => {
  return (
    <Layout>
      <Box>
        <Box height={56} />
        <AccountOverview />
        <Box height={40} />
        <Balances />
        <Box height={40} />
        <Markets />
        <Box height={40} />
        <ConvertHistoryTableBox />
        <Box height={40} />
        <InterestPaymentHistoryBox />
        <Box height={40} />
        <DepositHistoryBox />
        <Box height={40} />
        <WithdrawHistoryBox />
      </Box>
    </Layout>
  );
};

export default Index;
