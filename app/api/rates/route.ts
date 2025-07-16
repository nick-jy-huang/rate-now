import { NextRequest, NextResponse } from 'next/server';
import { getToday } from '@/utils/dateUtils';
import { fetchRates, getExchangeRate } from '@/utils/rateUtils';
import { prisma } from '@/lib/prisma';

const RTER_API_URL = process.env.RTER_API_URL;
if (!RTER_API_URL) {
  throw new Error('RTER_API_URL is not set in environment variables');
}

export async function GET(req: NextRequest) {
  const today = getToday();
  const { searchParams } = new URL(req.url);
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const date = searchParams.get('date') || today;

  try {
    if (from && to) {
      const rateRow = await prisma.rate.findUnique({
        where: { date_from_to: { date, from, to } },
      });
      if (rateRow) {
        return NextResponse.json({
          from,
          to,
          rate: rateRow.rate,
          date: rateRow.date,
          lastUpdated: rateRow.updatedAt,
        });
      } else {
        return NextResponse.json(
          { error: 'Currency not found' },
          { status: 400 },
        );
      }
    }

    const rates = await prisma.rate.findMany({ where: { date } });
    return NextResponse.json({ date, rates });
  } catch (e) {
    return NextResponse.json(
      { error: 'Failed to fetch rates from DB' },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const today = getToday();
  const { headers } = req;
  const host = headers.get('host');
  const protocol = host?.includes('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;
  try {
    const rates = await fetchRates(RTER_API_URL as string);
    const promises = Object.entries(rates).flatMap(([from, fromRate]) =>
      Object.entries(rates)
        .filter(([to]) => to !== from)
        .map(async ([to]) => {
          const rate = getExchangeRate(from, to, rates);
          const res = await fetch(`${baseUrl}/api/rates-db`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date: today, from, to, rate }),
          });
          if (!res.ok) {
            const errText = await res.text();
            throw new Error(
              `Failed to write rate ${from}->${to}: ${res.status} ${errText}`,
            );
          }
        }),
    );
    await Promise.allSettled(promises);
    return NextResponse.json({ message: 'Rates updated in DB' });
  } catch (e) {
    return NextResponse.json(
      { error: 'Failed to fetch or update rates', detail: String(e) },
      { status: 500 },
    );
  }
}
