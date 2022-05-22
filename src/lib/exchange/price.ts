import { DECIMALS, TokenType } from 'src/types/blockchain/token';

export const floor = (amount: number, type?: TokenType) => {
  const base = type ? Math.pow(10, DECIMALS[type]) : Math.pow(10, 2);
  return Math.floor(amount * base) / base;
};

export const decimalAmount = (amount: number, type?: TokenType) => {
  return floor(amount, type);
};

export const decimalAmountString = (amount: number, type: TokenType): string => {
  if (amount === undefined) {
    return amount;
  }
  return decimalAmount(amount, type).toFixed(DECIMALS[type]);
};

export const toFixed = (amount: number, type: TokenType): string => {
  if (amount === undefined) {
    return amount;
  }
  return amount.toFixed(DECIMALS[type]);
};

export const toFormatString = (amount: number | undefined, type?: TokenType) => {
  if (amount == undefined) {
    return '0';
  }

  return decimalAmount(amount, type).toLocaleString(undefined, {
    minimumFractionDigits: type ? DECIMALS[type] : 2,
    maximumFractionDigits: type ? DECIMALS[type] : 2,
  });
};
