import { Box, Typography } from '@material-ui/core';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import BorderedBox from 'src/components/atomic/Box/BorderedBox';
import { DateConditionButton } from 'src/components/atomic/Popper/DateConditionPopper';
import {
  SoteriaTable,
  SoteriaTableCell,
  SoteriaTableColumnData,
  SoteriaTableRow
} from 'src/components/atomic/Table/Table';
import NextLink from 'src/components/molecules/Text/NextLink';
import { useAuthContext } from 'src/hooks/auth/useAuthContext';
import { calculateToAmount } from 'src/hooks/exchange/useConvertUtil';
import { useConvertHistoryPagination } from 'src/hooks/history/useConvertHistories';
import { toFormatString } from 'src/lib/exchange/price';
import { ConvertHistoryCondition } from 'src/repository/convertHistories';
import { ConvertHistory } from 'src/types/blockchain/convertHistory';
import { NativeToken, tokenTypes } from 'src/types/blockchain/token';

const columns: SoteriaTableColumnData[] = [
  { name: 'From', widthRatio: 20 },
  { name: '', widthRatio: 8 },
  { name: 'To', widthRatio: 20 },
  { name: 'Price', widthRatio: 26 },
  { name: 'Status', widthRatio: 13 },
  { name: 'Date', widthRatio: 13 },
];

interface ConvertHistoryRowProps {
  history: ConvertHistory;
}

const ConvertHistoryRow: React.FC<ConvertHistoryRowProps> = ({ ...props }) => {
  const toTokenType =
    props.history.toCurrency ?? (props.history.fromCurrency === NativeToken ? tokenTypes[0] : NativeToken);

  return (
    <SoteriaTableRow>
      <SoteriaTableCell>
        <Typography fontWeight="bold">
          {toFormatString(props.history.amount, props.history.fromCurrency)} {props.history.fromCurrency}
        </Typography>
      </SoteriaTableCell>
      <SoteriaTableCell>
        <img src="/right-arrow.svg" />
      </SoteriaTableCell>
      <SoteriaTableCell>
        <Typography fontWeight="bold">
          {toFormatString(
            calculateToAmount(props.history.amount, props.history.fromCurrency, props.history.rate, toTokenType) ?? 0,
            toTokenType,
          )}{' '}
          {toTokenType}
        </Typography>
      </SoteriaTableCell>
      <SoteriaTableCell>
        <Typography>{toFormatString(props.history.rate)} USD</Typography>
      </SoteriaTableCell>
      <SoteriaTableCell>
        <Typography>{props.history.status}</Typography>
      </SoteriaTableCell>
      <SoteriaTableCell>
        <Typography>{dayjs(props.history.timestamp * 1000).format('YYYY/MM/DD')}</Typography>
        <Typography>{dayjs(props.history.timestamp * 1000).format('HH:mm:ss')}</Typography>
      </SoteriaTableCell>
    </SoteriaTableRow>
  );
};

interface ConvertHistoryTableProps {
  histories: ConvertHistory[];
}

const ConvertHistoryTable = ({ histories }: ConvertHistoryTableProps) => {
  return (
    <SoteriaTable columns={columns}>
      {histories.map((history, index) => (
        <ConvertHistoryRow history={history} key={index} />
      ))}
    </SoteriaTable>
  );
};

const ConvertHistoryTableBox = () => {
  const { uid } = useAuthContext();
  const [conditions, setConditions] = useState<ConvertHistoryCondition>({});
  const { histories } = useConvertHistoryPagination(uid, 1, 5, conditions);

  const handleOnApplyDateCondition = (fromDate: dayjs.Dayjs | null, toDate: dayjs.Dayjs | null) => {
    setConditions({
      datetime: {
        from: fromDate,
        to: toDate,
      },
    });
  };

  if (!histories) return null;
  return (
    <BorderedBox maxWidth={1132} mx="auto">
      <Box display="flex" flexDirection="row" justifyContent="space-between">
        <Typography variant="h2">Convert History</Typography>
        <DateConditionButton onApply={handleOnApplyDateCondition} />
      </Box>
      <Box height={20} />
      <ConvertHistoryTable histories={histories} />
      <Box height={26} />
      <NextLink href="/detail/convert_history" color="success.main">
        <Typography textAlign="center" color="success.main">
          More
        </Typography>
      </NextLink>
    </BorderedBox>
  );
};

export { ConvertHistoryTableBox, ConvertHistoryTable };
