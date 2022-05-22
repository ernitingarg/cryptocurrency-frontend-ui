import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useCallback, useEffect, useState } from 'react';
import UsdsTransactionRepository, { DepositHistoryCondition } from 'src/repository/usdsTransactions';
import { DepositHistory } from 'src/types/blockchain/depositHistory';
import { History } from 'src/types/blockchain/history';
import { NativeToken } from 'src/types/blockchain/token';
import { useAccount } from '../wallet/useAccount';
dayjs.extend(utc);

const repository = new UsdsTransactionRepository();

const PER_PAGE = 10;

export const useDepositHistoryPagination = (
  userId: string | null,
  initialPage = 1,
  perPage: number = PER_PAGE,
  condition: DepositHistoryCondition,
) => {
  const [histories, setHistories] = useState<History[]>();
  const [error, setError] = useState<Error>();
  const [page, setPage] = useState<number>(initialPage);
  const { account } = useAccount('ethereum');

  useEffect(() => {
    if (!userId || !account?.address) return;
    repository
      .subScribePagination(
        userId,
        account.address,
        page,
        perPage,
        'timestamp',
        'desc',
        (histories) => {
          setHistories(
            histories.map((history) => ({
              amount: history.amount,
              tokenType: NativeToken,
              status: 'done',
              datetime: dayjs.unix(history.timestamp).utc(),
            })),
          );
          return;
        },
        (error) => {
          console.log(error);
          setError(error);
        },
        condition,
      )
      .catch((error) => {
        console.log(error);
        setError(error);
      });
  }, [account, userId, perPage, page, condition]);

  return { histories, page, setPage, error };
};

export const useDepositHistoryPaginationInfo = (perPage: number = PER_PAGE, condition: DepositHistoryCondition) => {
  const [total, setTotal] = useState<number>(0);
  const [lastPage, setLastPage] = useState<number>(1);
  const { account } = useAccount('ethereum');

  useEffect(() => {
    if (!account?.address) return;
    repository
      .count(account.address, condition)
      .then((count) => {
        setTotal(count);
        setLastPage(Math.ceil(count / perPage));
        return;
      })
      .catch((error) => {
        console.log(error);
      });
  }, [account, condition]);

  useEffect(() => {
    setLastPage(Math.ceil(total / perPage));
  }, [perPage]);

  return { total, lastPage };
};

// This function is used by admin frontend and can be deleted later if not used anymore.
export const useDepositHistories = (userId: string | null) => {
  const [histories, setHistories] = useState<DepositHistory[]>();
  const [error, setError] = useState<Error>();
  const [limit, setLimit] = useState<number>(PER_PAGE);
  const [isMaxLimit, setMaxLimit] = useState<boolean>(false);
  const { account } = useAccount('ethereum');

  useEffect(() => {
    if (!userId || !account?.address) return;
    const unsubscribe = repository.subscribeDepositHistories(
      (histories) => {
        if (!histories) return;
        setHistories(histories);
      },
      userId,
      account.address,
      limit,
      (error) => setError(error),
    );

    return () => unsubscribe();
  }, [userId, limit, account?.address]);

  const moreHistories = useCallback(() => {
    setLimit((prev) => prev + PER_PAGE);
  }, []);

  useEffect(() => {
    if (!histories?.length) {
      setMaxLimit(true);
      return;
    }
    setMaxLimit(PER_PAGE > histories.length);
  }, [histories?.length]);

  return { histories, moreHistories, isMaxLimit, error };
};
