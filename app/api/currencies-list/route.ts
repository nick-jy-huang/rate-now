import { NextResponse } from 'next/server';
import { CURRENCIES } from '@/constants';

export async function GET() {
  return NextResponse.json(CURRENCIES);
} 