import dayjs from 'dayjs';

export function getToday() {
  return dayjs().format('YYYY-MM-DD');
}

export function isWithinDays(date: string, today: string, days: number) {
  return dayjs(today).diff(dayjs(date), 'day') < days;
}
