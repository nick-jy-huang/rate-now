'use client';

import CurrencyConverter from '@/components/CurrencyConverter';

export default function Home() {
  return (
    <main className="font-san flex min-h-screen items-start justify-center p-4 sm:items-center">
      <CurrencyConverter />
    </main>
  );
}
