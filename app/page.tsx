'use client';

import CurrencyConverter from '@/components/CurrencyConverter';

export default function Home() {
  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-sans sm:p-20">
      <main className="row-start-2 flex flex-col items-center gap-8 sm:items-start">
        <div className="w-full text-center">
          <h1 className="text-2xl font-bold text-white">匯率換算</h1>
        </div>

        <CurrencyConverter />
      </main>
    </div>
  );
}
