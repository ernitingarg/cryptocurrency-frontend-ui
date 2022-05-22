import React from 'react';
import { TokenType } from 'src/types/blockchain/token';

interface CoinIconProps {
  tokenType: TokenType;
}

const CoinIcon = ({ ...props }: CoinIconProps) => {
  const iconFile = `/${props.tokenType.toLowerCase()}-icon.svg`;
  return <img src={iconFile} />;
};

export default CoinIcon;
