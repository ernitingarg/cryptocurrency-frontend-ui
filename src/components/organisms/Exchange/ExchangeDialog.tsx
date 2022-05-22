import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import WithdrawPanel from 'src/components/molecules/Wallet/Dialog/WithdrawPanel';
import DepositPanel from 'src/components/molecules/Wallet/Dialog/DepositPanel';
import ConvertPanel from 'src/components/molecules/Wallet/Dialog/ConvertPanel';
import { TokenType } from 'src/types/blockchain/token';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: '4px 16px',
  },
  tabSelected: {
    fontWeight: theme.typography.fontWeightBold,
  },
}));

interface TabPanelProps {
  children?: React.ReactNode;
  number: number;
  value: number;
}

const TabPanel = ({ ...props }: TabPanelProps) => {
  return <Box hidden={props.value != props.number}>{props.children}</Box>;
};

export enum ExchangeDialogTab {
  deposit,
  withdraw,
  convert,
}

interface ExchangeDialogProps {
  defaultTab?: ExchangeDialogTab;
  defaultTokenType?: TokenType;
  onTransactionIsSuccessful?: () => void;
}

const ExchangeDialog = ({ ...props }: ExchangeDialogProps) => {
  const classes = useStyles();
  const [value, setValue] = useState(props.defaultTab ?? 0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <Tabs value={value} onChange={handleChange}>
        <Tab label="Deposit" className={value == 0 ? classes.tabSelected : ''} />
        <Tab label="Withdraw" className={value == 1 ? classes.tabSelected : ''} />
        <Tab label="Convert" className={value == 2 ? classes.tabSelected : ''} />
      </Tabs>
      <TabPanel number={0} value={value}>
        <DepositPanel />
      </TabPanel>
      <TabPanel number={1} value={value}>
        <WithdrawPanel onTransactionIsSuccessful={props.onTransactionIsSuccessful} />
      </TabPanel>
      <TabPanel number={2} value={value}>
        <ConvertPanel tokenType={props.defaultTokenType} onTransactionIsSuccessful={props.onTransactionIsSuccessful} />
      </TabPanel>
    </div>
  );
};

export default ExchangeDialog;
