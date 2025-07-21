import path from 'path';

export const CURRENCY_NAME_MAP: Record<string, string> = {
  USD: '美元',
  EUR: '歐元',
  JPY: '日圓',
  TWD: '新台幣',
  HKD: '港幣',
  GBP: '英鎊',
  AUD: '澳幣',
  CAD: '加幣',
  SGD: '新幣',
  CNY: '人民幣',
};

export const SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  JPY: '¥',
  TWD: 'NT$',
  HKD: 'HK$',
  GBP: '£',
  AUD: 'A$',
  CAD: 'C$',
  SGD: 'S$',
  CNY: '¥',
};

export const CURRENCIES = Object.keys(CURRENCY_NAME_MAP);
