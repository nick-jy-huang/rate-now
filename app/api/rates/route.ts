import { NextRequest, NextResponse } from 'next/server';
import dayjs from 'dayjs';
import { readCache, writeCache } from '@/utils/cacheUtils';
import { getToday, isWithinDays } from '@/utils/dateUtils';
import { fetchRates, getExchangeRate } from '@/utils/rateUtils';
import { HISTORY_DAYS, CACHE_FILE } from '@/constants';

const RTER_API_URL = process.env.RTER_API_URL;
if (!RTER_API_URL) {
  throw new Error('RTER_API_URL is not set in environment variables');
}

export async function GET(req: NextRequest) {
  let cache = readCache(CACHE_FILE);
  const today = getToday();
  const now = dayjs().valueOf();

  const { searchParams } = new URL(req.url);
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  if (cache && cache.history.some((d: any) => d.date === today)) {
    if (from && to) {
      const todayRates = cache.history.find(
        (d: any) => d.date === today,
      )?.rates;
      if (todayRates) {
        const rate = getExchangeRate(from, to, todayRates);
        if (rate !== null) {
          return NextResponse.json({
            from,
            to,
            rate,
            lastUpdated: cache.lastUpdated,
          });
        }
      }
      return NextResponse.json(
        { error: 'Currency not found' },
        { status: 400 },
      );
    }
    return NextResponse.json(cache);
  }

  try {
    const rates = await fetchRates(RTER_API_URL as string);
    let history = cache?.history || [];
    history = history.filter((d: any) =>
      isWithinDays(d.date, today, HISTORY_DAYS),
    );
    history.push({ date: today, rates });
    writeCache(CACHE_FILE, history, now);

    if (from && to) {
      const rate = getExchangeRate(from, to, rates);
      if (rate !== null) {
        return NextResponse.json({ from, to, rate, lastUpdated: now });
      } else {
        return NextResponse.json(
          { error: 'Currency not found' },
          { status: 400 },
        );
      }
    }
    return NextResponse.json({ history, lastUpdated: now });
  } catch (e) {
    if (cache) return NextResponse.json(cache);
    return NextResponse.json(
      { error: 'Failed to fetch rates' },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const today = getToday();
  const now = dayjs().valueOf();
  let cache = readCache(CACHE_FILE);
  try {
    const rates = await fetchRates(RTER_API_URL as string);
    let history = cache?.history || [];
    history = history.filter((d: any) =>
      isWithinDays(d.date, today, HISTORY_DAYS),
    );
    history = history.filter((d: any) => d.date !== today);
    history.push({ date: today, rates });
    writeCache(CACHE_FILE, history, now);
    return NextResponse.json({ history, lastUpdated: now });
  } catch (e) {
    if (cache) return NextResponse.json(cache);
    return NextResponse.json(
      { error: 'Failed to fetch rates' },
      { status: 500 },
    );
  }
}
