import { NextResponse } from 'next/server';
import { CURRENCIES, SYMBOLS } from '@/app/constants';

export async function GET() {
  const map: Record<string, string> = {};
  for (const cur of CURRENCIES) {
    map[cur] = SYMBOLS[cur] || '';
  }
  return NextResponse.json(map);
}
