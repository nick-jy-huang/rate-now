import dayjs from 'dayjs';

export function getToday() {
  return dayjs().format('YYYY-MM-DD');
}

export default dayjs;
