import { Box, Snackbar, Typography } from '@material-ui/core';
import DialogContent from '@material-ui/core/DialogContent';
import React, { useMemo, useState } from 'react';
import BorderedBox from 'src/components/atomic/Box/BorderedBox';
import BorderedButton from 'src/components/atomic/Button/BorderedButton';
import CoinIcon from 'src/components/atomic/Icon/CoinIcon';
import { SoteriaTable, SoteriaTableCell, SoteriaTableRow } from 'src/components/atomic/Table/Table';
import ExchangeDialog, { ExchangeDialogTab } from 'src/components/organisms/Exchange/ExchangeDialog';
import { useLastPrice } from 'src/hooks/exchange/useLastPrice';
import { useOneDayAgoPrice } from 'src/hooks/exchange/useOneDayAgoPrice';
import { useModal } from 'src/hooks/modal/useModal';
import { floor, toFormatString } from 'src/lib/exchange/price';
import { TokenPair, TokenType, tokenTypes } from 'src/types/blockchain/token';

const columns = [
  { name: 'Coin', widthRatio: 48 },
  { name: 'Price', widthRatio: 26 },
  { name: '24h Change', widthRatio: 13 },
  { name: '', widthRatio: 13 },
];

interface MarketRowProps {
  tokenType: TokenType;
}

const MarketRow: React.FC<MarketRowProps> = ({ ...props }, key) => {
  const [{ onOpen, onClose }, renderModal] = useModal();

  const tokenPair = `${props.tokenType}-USD` as TokenPair;
  const [price, priceError] = useLastPrice(tokenPair);
  const [oneDayAgoPrice, oneDayAgoPriceError] = useOneDayAgoPrice(tokenPair);

  if (priceError) {
    console.error(priceError);
  }
  if (oneDayAgoPriceError) {
    console.error(oneDayAgoPriceError);
  }

  const changeRate = useMemo(() => {
    return floor(((price ?? 1) / (oneDayAgoPrice ?? 1) - 1) * 100);
  }, [price, oneDayAgoPrice]);
  const [isOpenSnackbar, setIsOpenSnackbar] = useState<boolean>(false);

  return (
    <SoteriaTableRow key={key}>
      <SoteriaTableCell>
        <CoinIcon tokenType={props.tokenType} />
        <span style={{ paddingLeft: '16px' }}>{props.tokenType}</span>
      </SoteriaTableCell>
      <SoteriaTableCell>
        <Typography fontWeight={'bold'}>{toFormatString(price)}&nbsp;USD</Typography>
      </SoteriaTableCell>
      <SoteriaTableCell>
        {changeRate >= 0 ? (
          <Typography fontWeight={'bold'} color="success.main" component="span">
            +{changeRate}%
          </Typography>
        ) : (
          <Typography fontWeight={'bold'} color="warning.main" component="span">
            {changeRate}%
          </Typography>
        )}
      </SoteriaTableCell>
      <SoteriaTableCell>
        <BorderedButton style={{ marginLeft: 'auto' }} onClick={onOpen}>
          <Typography color="success.main" style={{ textTransform: 'none' }}>
            Convert
          </Typography>
        </BorderedButton>
      </SoteriaTableCell>
      {renderModal({
        children: (
          <DialogContent>
            <ExchangeDialog
              defaultTab={ExchangeDialogTab.convert}
              defaultTokenType={props.tokenType}
              onTransactionIsSuccessful={() => {
                onClose();
                setIsOpenSnackbar(true);
                setTimeout(() => setIsOpenSnackbar(false), 3000);
              }}
            />
          </DialogContent>
        ),
      })}
      <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} open={isOpenSnackbar} message="Successful" />
    </SoteriaTableRow>
  );
};

const Markets = () => {
  return (
    <BorderedBox maxWidth={1132} mx="auto">
      <Typography variant="h2">Market</Typography>
      <Box height={20} />
      <SoteriaTable columns={columns}>
        {tokenTypes.map((tokenType: TokenType, index) => {
          return <MarketRow tokenType={tokenType} key={index} />;
        })}
      </SoteriaTable>
    </BorderedBox>
  );
};

export default Markets;
