import ConversionFeeRateRepository from 'src/repository/conversionFeeRate';
import { TokenType } from 'src/types/blockchain/token';
import useSWR from 'swr';

const repository = new ConversionFeeRateRepository();

export const useConversionFeeRate = (fromType: TokenType, toType: TokenType) => {
  return useSWR<number, Error>(['conversion-fee-rate', fromType], {
    fetcher: (_key, fromType) => {
      return repository.get(fromType, toType);
    },
  });
};
