import { useCallback, useEffect, useState } from 'react';
import WithdrawRequestRepository, { WithdrawHistoryCondition } from 'src/repository/withdrawRequests';
import { WithdrawHistory } from 'src/types/blockchain/withdrawHistory';
import { History } from 'src/types/blockchain/history';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

const repository = new WithdrawRequestRepository();

const PER_PAGE = 10;

export const useWithdrawHistoryPagination = (
  userId: string | null,
  initialPage = 1,
  perPage: number = PER_PAGE,
  condition: WithdrawHistoryCondition,
) => {
  const [histories, setHistories] = useState<History[]>();
  const [error, setError] = useState<Error>();
  const [page, setPage] = useState<number>(initialPage);

  useEffect(() => {
    if (!userId) return;
    repository
      .subScribePagination(
        userId,
        page,
        perPage,
        'datetime',
        'desc',
        (histories) => {
          setHistories(
            histories.map((history) => ({
              amount: history.amount * -1,
              tokenType: history.tokenType,
              status: history.status,
              datetime: dayjs(history.timestamp * 1000).utc(),
            })),
          );
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
  }, [userId, perPage, page, condition]);

  return { histories, page, setPage, error };
};

export const useWithdrawHistoryPaginationInfo = (
  userId: string | null,
  perPage: number = PER_PAGE,
  condition: WithdrawHistoryCondition,
) => {
  const [total, setTotal] = useState<number>(0);
  const [lastPage, setLastPage] = useState<number>(1);

  useEffect(() => {
    if (!userId) return;
    repository
      .count(userId, condition)
      .then((count) => {
        setTotal(count);
        setLastPage(Math.ceil(count / perPage));
        return;
      })
      .catch((error) => {
        console.log(error);
      });
  }, [userId, condition]);

  useEffect(() => {
    if (!userId) return;
    setLastPage(Math.ceil(total / perPage));
  }, [userId, perPage]);

  return { total, lastPage };
};

export const useWithdrawHistories = (userId: string | null) => {
  const [histories, setHistories] = useState<WithdrawHistory[]>();
  const [error, setError] = useState<Error>();
  const [limit, setLimit] = useState<number>(PER_PAGE);
  const [isMaxLimit, setMaxLimit] = useState<boolean>(false);

  useEffect(() => {
    if (!userId) return;
    const unsubscribe = repository.subscribeByUser(
      (histories) => {
        if (!histories) return;
        setHistories(histories);
      },
      userId,
      limit,
      (error) => setError(error),
    );

    return () => unsubscribe();
  }, [userId, limit]);

  const moreHistories = useCallback(() => {
    setLimit((prev) => prev + PER_PAGE);
  }, []);

  useEffect(() => {
    if (!histories?.length) {
      setMaxLimit(true);
      return;
    }
    setMaxLimit(limit > histories.length);
  }, [histories?.length, limit]);

  return { histories, moreHistories, isMaxLimit, error };
};
