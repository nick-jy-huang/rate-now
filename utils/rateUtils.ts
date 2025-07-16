import { CURRENCIES } from '@/constants';

export async function fetchRates(apiUrl: string) {
  const url = apiUrl;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch rates');
  const json = await res.json();
  const usdtwd = json['USDTWD']?.Exrate;
  if (!usdtwd) throw new Error('USDTWD not found');
  const rates: Record<string, number> = {};
  for (const cur of CURRENCIES) {
    if (cur === 'TWD') {
      rates['TWD'] = 1;
    } else {
      const usdCur = json[`USD${cur}`]?.Exrate;
      if (usdCur) {
        rates[cur] = usdtwd / usdCur;
      }
    }
  }
  return rates;
}

export function getExchangeRate(
  from: string,
  to: string,
  rates: Record<string, number>,
) {
  if (rates[from] && rates[to]) {
    return rates[from] / rates[to];
  }
  return null;
}
