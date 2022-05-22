import { decimalAmount } from 'src/lib/exchange/price';
import { NativeToken, TokenType, tokenTypes } from 'src/types/blockchain/token';

export const useRequiredTokenTypes = (fromTokenType: TokenType | undefined): any => {
  return !fromTokenType
    ? tokenTypes
    : fromTokenType === NativeToken
    ? tokenTypes.filter((t) => t !== NativeToken)
    : tokenTypes.filter((t) => t === NativeToken);
};

export const calculateToAmount = (
  fromAmount: number | undefined,
  fromTokenType: TokenType,
  conversionPrice: number | undefined,
  toTokenType: TokenType,
): number | null => {
  if (!conversionPrice || !fromAmount || !isFinite(Number(fromAmount))) {
    return null;
  }
  const rate = fromTokenType !== NativeToken ? conversionPrice : 1.0 / conversionPrice;
  return decimalAmount(fromAmount * rate, toTokenType);
};
