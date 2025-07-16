import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { date, from, to, rate } = await req.json();
  const upserted = await prisma.rate.upsert({
    where: { date_from_to: { date, from, to } },
    update: { rate },
    create: { date, from, to, rate },
  });
  return NextResponse.json(upserted);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const date = searchParams.get('date');
  const where: any = {};
  if (from) where.from = from;
  if (to) where.to = to;
  if (date) where.date = date;
  const rates = await prisma.rate.findMany({ where });
  return NextResponse.json(rates);
}
