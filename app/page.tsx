'use client';

import CurrencyConverter from '@/components/CurrencyConverter';

export default function Home() {
  return (
    <div className="font-san">
      <main className="flex min-h-screen items-start justify-center p-4 sm:items-center">
        <CurrencyConverter />
      </main>
    </div>
  );
}
