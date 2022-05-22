import { useCallback, useEffect, useState } from 'react';
import ConvertHistoryRepository, { ConvertHistoryCondition } from 'src/repository/convertHistories';
import { ConvertHistory } from 'src/types/blockchain/convertHistory';

const repository = new ConvertHistoryRepository();

const PER_PAGE = 10;

export const useConvertHistoryPagination = (
  userId: string | null,
  initialPage = 1,
  perPage: number = PER_PAGE,
  condition: ConvertHistoryCondition,
) => {
  const [histories, setHistories] = useState<ConvertHistory[]>();
  const [error, setError] = useState<Error>();
  const [page, setPage] = useState<number>(initialPage);

  useEffect(() => {
    if (!userId) return;
    repository
      .subscribePagination(
        userId,
        page,
        perPage,
        'datetime',
        'desc',
        (histories) => {
          setHistories(histories);
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

export const useConvertHistoryPaginationInfo = (
  userId: string | null,
  perPage: number = PER_PAGE,
  condition: ConvertHistoryCondition,
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

export const useConvertHistories = (userId: string | null) => {
  const [histories, setHistories] = useState<ConvertHistory[]>();
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
      'datetime',
      'desc',
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
