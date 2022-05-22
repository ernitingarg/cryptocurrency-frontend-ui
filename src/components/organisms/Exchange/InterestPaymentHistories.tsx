import dayjs from 'dayjs';
import React, { useState } from 'react';
import { HistoryTableBox } from 'src/components/organisms/Exchange/Histories';
import { useAuthContext } from 'src/hooks/auth/useAuthContext';
import { useInterestPaymentHistoryPagination } from 'src/hooks/history/useInterestHistories';
import { InterestPaymentHistoryCondition } from 'src/repository/interestPaymentHistories';

const InterestPaymentHistoryBox = () => {
  const { uid } = useAuthContext();
  const [conditions, setConditions] = useState<InterestPaymentHistoryCondition>({});
  const { histories } = useInterestPaymentHistoryPagination(uid, 1, 5, conditions);

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
      title="Interest Payment History"
      histories={histories}
      paginationUrl="/detail/interest_payment_history"
      onChangeDate={handleOnChangeDate}
    />
  );
};

export default InterestPaymentHistoryBox;
