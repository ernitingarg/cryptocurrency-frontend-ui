import { Box, Typography } from '@material-ui/core';
import React from 'react';
import BorderedBox from 'src/components/atomic/Box/BorderedBox';
import {
  SoteriaTable,
  SoteriaTableCell,
  SoteriaTableColumnData,
  SoteriaTableRow,
} from 'src/components/atomic/Table/Table';
import { History } from 'src/types/blockchain/history';
import CoinIcon from 'src/components/atomic/Icon/CoinIcon';
import NextLink from 'src/components/molecules/Text/NextLink';
import { DateConditionButton } from 'src/components/atomic/Popper/DateConditionPopper';
import dayjs from 'dayjs';
import { toFormatString } from 'src/lib/exchange/price';

const columns: SoteriaTableColumnData[] = [
  { name: 'Amount', widthRatio: 74 },
  { name: 'Status', widthRatio: 13 },
  { name: 'Date', widthRatio: 12 },
  { name: '', widthRatio: 1 },
];

interface HistoryRowProps {
  history: History;
}

const HistoryRow: React.FC<HistoryRowProps> = ({ ...props }) => {
  return (
    <SoteriaTableRow>
      <SoteriaTableCell>
        <CoinIcon tokenType={props.history.tokenType} />
        <Typography fontWeight="bold" component="span" style={{ paddingLeft: '16px' }}>
          {props.history.amount > 0 ? '+' : ''}
          {toFormatString(props.history.amount, props.history.tokenType)} {props.history.tokenType}
        </Typography>
      </SoteriaTableCell>
      <SoteriaTableCell>
        <Typography>{props.history.status}</Typography>
      </SoteriaTableCell>
      <SoteriaTableCell>
        <Typography>{props.history.datetime.format('YYYY/MM/DD')}</Typography>
        <Typography>{props.history.datetime.format('HH:mm:ss')}</Typography>
      </SoteriaTableCell>
    </SoteriaTableRow>
  );
};

interface HistoryTableProps {
  histories: History[];
}

const HistoryTable = ({ histories }: HistoryTableProps) => {
  return (
    <SoteriaTable columns={columns}>
      {histories.map((history, index) => (
        <HistoryRow key={index} history={history} />
      ))}
    </SoteriaTable>
  );
};

interface HistoryTableBoxProps {
  title: string;
  histories: History[];
  paginationUrl: string;
  onChangeDate: (fromDate: dayjs.Dayjs | null, toDate: dayjs.Dayjs | null) => void;
}

const HistoryTableBox = ({ title, histories, paginationUrl, onChangeDate }: HistoryTableBoxProps) => {
  return (
    <BorderedBox maxWidth={1132} mx="auto">
      <Box display="flex" flexDirection="row" justifyContent="space-between">
        <Typography variant="h2">{title}</Typography>
        <DateConditionButton onApply={onChangeDate} />
      </Box>
      <Box height={20} />
      <HistoryTable histories={histories} />
      <Box height={26} />
      <NextLink href={paginationUrl} color="success.main">
        <Typography textAlign="center">More</Typography>
      </NextLink>
    </BorderedBox>
  );
};

export { HistoryTableBox, HistoryTable };
