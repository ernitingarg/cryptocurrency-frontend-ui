import { Box, Button, Grid, MenuItem, Select, Snackbar, Typography } from '@material-ui/core';
import { CopyAll } from '@material-ui/icons';
import React, { useState } from 'react';
// @ts-ignore
import CopyToClipBoard from 'react-copy-to-clipboard';
import CoinIcon from 'src/components/atomic/Icon/CoinIcon';
import { useAccount } from 'src/hooks/wallet/useAccount';
import { BlockChainType } from 'src/types/blockchain/chain';
import { TokenType, tokenTypes } from 'src/types/blockchain/token';

interface DepositPanelProps {
  tokenType?: TokenType;
}

const toBlockchainType = (type: TokenType): BlockChainType => {
  switch (type) {
    case 'BTC':
      return 'bitcoin';
    default:
      return 'ethereum';
  }
};

const DepositPanel = ({ ...props }: DepositPanelProps) => {
  const [tokenType, setTokenType] = useState<TokenType>(props.tokenType ?? tokenTypes[0]);
  const [isOpenSnackbar, setIsOpenSnackbar] = useState<boolean>(false);
  const account = useAccount(toBlockchainType(tokenType));

  const handleCoinChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setTokenType(event.target.value as TokenType);
  };
  const handleClickCopy = () => {
    setIsOpenSnackbar(true);
    setTimeout(() => setIsOpenSnackbar(false), 2000);
  };
  const handleCloseSnack = () => {
    setIsOpenSnackbar(false);
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
        Deposit {tokenType} Address
      </Typography>
      <Grid container>
        <Grid item xs={11} m={'auto'}>
          <Typography fontWeight={'bold'}>
            {!account.account && 'No Address'}
            {account.account && account.account.address}
          </Typography>
        </Grid>
        <Grid item xs={1} m={'auto'}>
          <CopyToClipBoard text={account?.account?.address ?? ''}>
            <Button onClick={handleClickCopy}>
              <CopyAll />
            </Button>
          </CopyToClipBoard>
        </Grid>
      </Grid>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={isOpenSnackbar}
        onClose={handleCloseSnack}
        message="Copied the address."
      />
    </Box>
  );
};

export default DepositPanel;
