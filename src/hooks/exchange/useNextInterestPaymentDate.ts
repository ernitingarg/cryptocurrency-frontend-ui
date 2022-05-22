import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';

// 今のところUTC時間の0時にInterestPaymentが発行される前提で組んでいる
const createNextDate = (date: dayjs.Dayjs): dayjs.Dayjs => {
  const nextDate = date.clone();
  return nextDate.add(1, 'day').set('hour', 0).set('minute', 55).set('second', 0);
};

const runPeriodically = (
  now: dayjs.Dayjs,
  nextDate: dayjs.Dayjs,
  resolve: (nextDate: dayjs.Dayjs) => void,
): Promise<void> => {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, (nextDate.unix() - now.unix()) * 1000);
  }).then(() => {
    const afterNextDate = createNextDate(nextDate);
    resolve(afterNextDate);
    return runPeriodically(nextDate, afterNextDate, resolve);
  });
};

export const useNextInterestPaymentDate = (): [dayjs.Dayjs, string] => {
  const [nextDate, setNextDate] = useState<dayjs.Dayjs>(createNextDate(dayjs()));
  const nextDateString = useMemo(() => {
    return nextDate.format('YYYY/MM/DD HH:mm:ss');
  }, [nextDate]);

  useEffect(() => {
    runPeriodically(dayjs(), nextDate, (nextDate: dayjs.Dayjs) => {
      setNextDate(nextDate);
    });
  });
  return [nextDate, nextDateString];
};
