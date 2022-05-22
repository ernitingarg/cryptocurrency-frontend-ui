import { HistoryTableBox } from 'src/components/organisms/Exchange/Histories';
import React, { useState } from 'react';
import { useAuthContext } from 'src/hooks/auth/useAuthContext';
import dayjs from 'dayjs';
import { useWithdrawHistoryPagination } from 'src/hooks/history/useWithdrawHistories';
import { WithdrawHistoryCondition } from 'src/repository/withdrawRequests';

const WithdrawHistoryBox = () => {
  const { uid } = useAuthContext();
  const [conditions, setConditions] = useState<WithdrawHistoryCondition>({});
  const { histories } = useWithdrawHistoryPagination(uid, 1, 5, conditions);

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
      title="Withdraw History"
      histories={histories}
      paginationUrl="/detail/withdraw_history"
      onChangeDate={handleOnChangeDate}
    />
  );
};

export default WithdrawHistoryBox;
