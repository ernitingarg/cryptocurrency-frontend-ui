import { HistoryTableBox } from 'src/components/organisms/Exchange/Histories';
import React, { useState } from 'react';
import { useAuthContext } from 'src/hooks/auth/useAuthContext';
import dayjs from 'dayjs';
import { DepositHistoryCondition } from 'src/repository/usdsTransactions';
import { useDepositHistoryPagination } from 'src/hooks/history/useDepositHistories';

const DepositHistoryBox = () => {
  const { uid } = useAuthContext();
  const [conditions, setConditions] = useState<DepositHistoryCondition>({});
  const { histories } = useDepositHistoryPagination(uid, 1, 5, conditions);

  const handleOnChangeDate = (fromDate: dayjs.Dayjs | null, toDate: dayjs.Dayjs | null) => {
    setConditions({
      datetime: {
        from: fromDate,
        to: toDate,
      },
    });
  };

  if (!histories) return null;
  return (
    <HistoryTableBox
      title="Deposit History"
      histories={histories}
      paginationUrl="/detail/deposit_history"
      onChangeDate={handleOnChangeDate}
    />
  );
};

export default DepositHistoryBox;
