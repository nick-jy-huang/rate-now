'use client';

import CurrencyConverter from '@/components/CurrencyConverter';

export default function Home() {
  return (
    <div className="grid min-h-screen items-center justify-items-center p-8 font-sans sm:p-20">
      <main className="row-start-2 flex flex-col items-center gap-4 sm:items-center">
        <img src="/icon/favicon.svg" alt="logo" className="h-24 w-24" />

        <div className="rounded-full bg-white px-6 py-2">
          <h1 className="text-3xl font-bold text-black">Rate Now</h1>
        </div>

        <CurrencyConverter />
      </main>
    </div>
  );
}
