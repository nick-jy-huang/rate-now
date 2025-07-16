import { NextResponse } from 'next/server';
import { CURRENCIES } from '@/app/constants';

export async function GET() {
  return NextResponse.json(CURRENCIES);
}
