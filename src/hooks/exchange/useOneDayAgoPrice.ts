import { useEffect, useState } from 'react';
import PriceHistoryRepository from 'src/repository/priceHistories';
import { stableTokenPairs, TokenPair } from 'src/types/blockchain/token';

const priceHistoryRepository = new PriceHistoryRepository();
export const useOneDayAgoPrice = (tokenPair: TokenPair): [number | undefined, Error | undefined] => {
  const [oneDayAgoPrice, setOneDayAgoPrice] = useState<number>();
  const [oneDayAgoPriceError, setError] = useState<Error>();

  useEffect(() => {
    if (stableTokenPairs.includes(tokenPair)) {
      setOneDayAgoPrice(1);
      setError(undefined);
      return;
    }
    const unsubscribe = priceHistoryRepository.subscribeOneDayAgo(
      tokenPair,
      (history) => {
        if (!history?.rate) return;
        setOneDayAgoPrice(history.rate);
      },
      (error) => {
        setError(error);
      },
    );

    return () => unsubscribe();
  }, [tokenPair]);
  return [oneDayAgoPrice, oneDayAgoPriceError];
};
