'use client';

import CurrencyConverter from '@/components/CurrencyConverter';

export default function Home() {
  return (
    <div className="font-san flex min-h-screen items-center justify-center">
      <main className="flex flex-col items-center gap-4 sm:items-center">
        <CurrencyConverter />
      </main>
    </div>
  );
}
