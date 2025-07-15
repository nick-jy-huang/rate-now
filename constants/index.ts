import path from 'path';

export const CURRENCIES = ['USD', 'EUR', 'JPY', 'TWD', 'HKD', 'GBP', 'AUD', 'CAD', 'SGD', 'CNY'];
export const HISTORY_DAYS = 30;
export const CACHE_FILE = path.join(process.cwd(), 'public', 'rates.json');
