import { Box, Typography } from '@material-ui/core';
import React from 'react';
import BorderedBox from 'src/components/atomic/Box/BorderedBox';
import CoinIcon from 'src/components/atomic/Icon/CoinIcon';
import {
  SoteriaTable,
  SoteriaTableCell,
  SoteriaTableColumnData,
  SoteriaTableRow
} from 'src/components/atomic/Table/Table';
import { useBalance } from 'src/hooks/wallet/useBalance';
import { floor, toFormatString } from 'src/lib/exchange/price';
import { TokenType, tokenTypes } from 'src/types/blockchain/token';

const columns: SoteriaTableColumnData[] = [
  { name: 'Name', widthRatio: 48 },
  { name: 'Balance', widthRatio: 26 },
  { name: 'Locked balance', widthRatio: 26 },
];

interface BalanceRowProps {
  tokenType: TokenType;
  balances: { amount: number; value: number };
  lockedBalances: { amount: number; value: number };
}

const BalanceRow: React.FC<BalanceRowProps> = ({ ...props }, key) => {
  return (
    <SoteriaTableRow key={key}>
      <SoteriaTableCell>
        <CoinIcon tokenType={props.tokenType} />
        <span style={{ paddingLeft: '16px' }}>{props.tokenType}</span>
      </SoteriaTableCell>
      <SoteriaTableCell>
        <Typography fontWeight={'bold'}>
          {toFormatString(props.balances.amount, props.tokenType)}&nbsp;{props.tokenType}
        </Typography>
        <Typography fontWeight={'bold'}>{toFormatString(floor(props.balances.value))}&nbsp;USD</Typography>
      </SoteriaTableCell>
      <SoteriaTableCell>
        <Typography>
          {toFormatString(props.lockedBalances.amount, props.tokenType)}&nbsp;{props.tokenType}
        </Typography>
        <Typography>{toFormatString(floor(props.lockedBalances.value))}&nbsp;USD</Typography>
      </SoteriaTableCell>
    </SoteriaTableRow>
  );
};

const Balances = () => {
  const { balance } = useBalance();

  return (
    <BorderedBox maxWidth={1132} mx="auto">
      <Typography variant="h2">Balance</Typography>
      <Box height={20} />
      <SoteriaTable columns={columns}>
        {tokenTypes.map((tokenType: TokenType, index) => {
          return (
            <BalanceRow
              key={index}
              tokenType={tokenType}
              balances={{ amount: balance?.balance?.[tokenType] ?? 0, value: balance?.value?.[tokenType] ?? 0 }}
              lockedBalances={{
                amount: balance?.pendingBalance?.[tokenType] ?? 0,
                value: balance?.pendingValue?.[tokenType] ?? 0,
              }}
            />
          );
        })}
      </SoteriaTable>
    </BorderedBox>
  );
};

export default Balances;
