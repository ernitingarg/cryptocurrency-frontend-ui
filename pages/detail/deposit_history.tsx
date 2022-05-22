import { Box, Grid, Pagination, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import { NextPage } from 'next';
import { DateConditionButton } from 'src/components/atomic/Popper/DateConditionPopper';
import { useAuthContext } from 'src/hooks/auth/useAuthContext';
import dayjs from 'dayjs';
import { makeStyles } from '@material-ui/core/styles';
import { HistoryTable } from 'src/components/organisms/Exchange/Histories';
import { DepositHistoryCondition } from 'src/repository/usdsTransactions';
import { useDepositHistoryPagination, useDepositHistoryPaginationInfo } from 'src/hooks/history/useDepositHistories';
import Layout from 'src/components/organisms/Layout/Layout';

const useStyles = makeStyles((theme) => ({
  pagination: {
    color: theme.palette.success.main,
  },
}));

const DepositHistoryPagination: NextPage = () => {
  const classes = useStyles();
  const { uid } = useAuthContext();
  const perPage = 10;
  const [conditions, setConditions] = useState<DepositHistoryCondition>({});
  const { histories, page, setPage } = useDepositHistoryPagination(uid, 1, perPage, conditions);
  const { lastPage } = useDepositHistoryPaginationInfo(perPage, conditions);

  const handleOnApplyDateCondition = (fromDate: dayjs.Dayjs | null, toDate: dayjs.Dayjs | null) => {
    setConditions({
      datetime: {
        from: fromDate,
        to: toDate,
      },
    });
    setPage(1);
  };

  return (
    <Layout>
      <Box maxWidth={1132} mx="auto">
        <Box height={68} />
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          <Typography variant="h2">Deposit History</Typography>
          <DateConditionButton onApply={handleOnApplyDateCondition} />
        </Box>
        <Box height={20} />
        <HistoryTable histories={histories ?? []} />
        <Grid container direction="row" justifyContent="center" mt={5}>
          <Pagination
            className={classes.pagination}
            count={lastPage}
            page={page}
            variant="outlined"
            shape="rounded"
            onChange={(_event: React.ChangeEvent<unknown>, page: number) => {
              setPage(page);
            }}
          />
        </Grid>
      </Box>
    </Layout>
  );
};

export default DepositHistoryPagination;
