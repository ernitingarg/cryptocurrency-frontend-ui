import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useCallback, useEffect, useState } from 'react';
import InterestPaymentHistoryRepository, {
  InterestPaymentHistoryCondition,
} from 'src/repository/interestPaymentHistories';
import { History } from 'src/types/blockchain/history';
import { InterestPaymentHistory } from 'src/types/blockchain/interestPaymentHistory';
import { NativeToken } from 'src/types/blockchain/token';
dayjs.extend(utc);
const repository = new InterestPaymentHistoryRepository();

const PER_PAGE = 10;

export const useInterestPaymentHistoryPagination = (
  userId: string | null,
  initialPage = 1,
  perPage: number = PER_PAGE,
  condition: InterestPaymentHistoryCondition,
) => {
  const [histories, setHistories] = useState<History[]>();
  const [error, setError] = useState<Error>();
  const [page, setPage] = useState<number>(initialPage);

  useEffect(() => {
    if (!userId) return;
    repository
      .subscribePagination(
        userId,
        page,
        perPage,
        'timestamp',
        'desc',
        (histories) => {
          setHistories(
            histories.map((history) => ({
              amount: history.interestPayment,
              tokenType: NativeToken,
              status: 'done',
              datetime: dayjs.unix(history.timestamp).utc(),
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

export const useInterestPaymentHistoryPaginationInfo = (
  userId: string | null,
  perPage: number = PER_PAGE,
  condition: InterestPaymentHistoryCondition,
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
  }, [perPage]);

  return { total, lastPage };
};

// This function is used by admin frontend and can be deleted later if not used anymore.
export const useInterestHistories = (userId: string | null) => {
  const [histories, setHistories] = useState<InterestPaymentHistory[]>();
  const [error, setError] = useState<Error>();
  const [limit, setLimit] = useState<number>(PER_PAGE);
  const [isMaxLimit, setMaxLimit] = useState<boolean>(false);

  useEffect(() => {
    if (!userId) return;
    const unsubscribe = repository.subscribeOrderBy(
      (histories) => {
        if (!histories) return;
        setHistories(histories);
      },
      userId,
      'timestamp',
      'desc',
      limit,
      (error) => setError(error),
    );

    return () => unsubscribe();
  }, [limit, userId]);

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
