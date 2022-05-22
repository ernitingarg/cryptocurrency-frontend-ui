import { useEffect, useState } from 'react';
import PriceHistoryRepository from 'src/repository/priceHistories';
import { stableTokenPairs, TokenPair } from 'src/types/blockchain/token';

const priceHistoryRepository = new PriceHistoryRepository();
export const useLastPrice = (tokenPair: TokenPair): [number | undefined, Error | undefined] => {
  const [price, setPrice] = useState<number>();
  const [priceError, setError] = useState<Error>();

  useEffect(() => {
    if (stableTokenPairs.includes(tokenPair)) {
      setPrice(1);
      setError(undefined);
      return;
    }
    const unsubscribe = priceHistoryRepository.subscribeLatestOne(
      tokenPair,
      (history) => {
        if (!history?.rate) return;
        setPrice(history.rate);
      },
      (error) => {
        setError(error);
      },
    );

    return () => unsubscribe();
  }, [tokenPair]);
  return [price, priceError];
};
