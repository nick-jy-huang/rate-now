import React, { useEffect, useState } from 'react';
import CountUp from 'react-countup';
import dayjs from 'dayjs';
import { CURRENCY_NAME_MAP } from '@/constants';

export default function CurrencyConverter() {
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('TWD');
  const [fromAmount, setFromAmount] = useState(1);
  const [toAmount, setToAmount] = useState(0);
  const [rate, setRate] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchRate = async (f: string, t: string) => {
    setError('');
    try {
      const res = await fetch(`/api/rates?from=${f}&to=${t}`);
      const data = await res.json();
      if (data.rate) {
        setRate(data.rate);

        const toAmount = Number((fromAmount * data.rate).toFixed(4));
        setToAmount(toAmount);

        setLastUpdated(
          data.lastUpdated
            ? dayjs(data.lastUpdated).format('YYYY-MM-DD HH:mm:ss')
            : 'None',
        );
      } else {
        setRate(null);
        setToAmount(0);
        setError('Currency not found');
      }
    } catch (e) {
      setError('API connected failed');
    }
  };

  useEffect(() => {
    fetch('/api/currencies-list')
      .then((res) => res.json())
      .then((data) => setCurrencies(data))
      .catch(() => setCurrencies([]));
  }, []);

  useEffect(() => {
    fetchRate(from, to);
  }, [from, to]);

  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setFromAmount(val);

    if (rate) setToAmount(Number((val * rate).toFixed(4)));
  };

  const handleToAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setToAmount(val);

    if (rate && rate !== 0) setFromAmount(Number((val / rate).toFixed(4)));
  };

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  const handleManualUpdate = async () => {
    setLoading(true);
    setError('');
    try {
      await fetch('/api/rates', { method: 'POST' });
      fetchRate(from, to);
    } catch (e) {
      setError('API 連線失敗');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative mx-auto flex max-w-xl flex-col items-center gap-4 rounded-xl border-2 bg-white p-4 shadow-lg md:p-8">
      <div className="pointer-events-auto absolute top-0 left-0 z-10 h-[110px] w-[110px] overflow-hidden">
        <a
          href="https://tw.rter.info"
          target="_blank"
          className="absolute top-8 left-[-40px] w-[160px] -rotate-45 bg-green-600 py-1 text-center text-sm font-bold tracking-wider text-white shadow-md duration-200 hover:scale-110"
        >
          資料來源
          <i className="fa-solid fa-arrow-up-right-from-square ml-2 text-xs"></i>
        </a>
      </div>
      <img
        src="/icon-192.png"
        alt="logo"
        className="h-24 w-24 duration-200 hover:scale-120 hover:rotate-180"
      />

      <h1 className="text-center text-3xl">Rate Now</h1>

      <h1 className="text-xl font-bold text-black">
        {!error && (
          <div className="flex items-center gap-2">
            <span className="flex gap-2.5">
              <CountUp end={1} decimals={1} duration={0.5} preserveValue />
              <span>{from}</span> ≈
              <span className="font-bold text-green-600">
                <CountUp
                  end={rate ?? 0}
                  decimals={4}
                  duration={0.6}
                  preserveValue
                />
              </span>
              <span>{to}</span>
            </span>
          </div>
        )}
        {error && <span className="text-red-500">{error}</span>}
      </h1>

      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex flex-1 flex-col items-center">
          <div className="relative w-full">
            <select
              className="mb-2 h-11 w-full appearance-none rounded border-2 px-3 py-2"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            >
              {currencies.map((code) => (
                <option key={code} value={code}>
                  {code} - {CURRENCY_NAME_MAP[code] || code}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute top-6 right-4 -translate-y-3 text-black">
              <i className="fa-solid fa-chevron-down"></i>
            </span>
          </div>
          <input
            type="number"
            className="w-full rounded border-2 px-3 py-2 text-right"
            value={fromAmount}
            min={0}
            onChange={handleFromAmountChange}
          />
        </div>

        <button
          className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-2 p-4 text-xl text-black duration-300 hover:rotate-180 hover:border-2 hover:border-green-500 hover:text-green-500"
          onClick={handleSwap}
          title="交換幣別"
        >
          <span className="fa-solid fa-right-left rotate-90 duration-300 md:rotate-0"></span>
        </button>

        <div className="flex flex-col items-center">
          <div className="relative w-full">
            <select
              className="mb-2 h-11 w-full appearance-none rounded border-2 px-3 py-2"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            >
              {currencies.map((code) => (
                <option key={code} value={code}>
                  {code} - {CURRENCY_NAME_MAP[code] || code}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute top-6 right-4 -translate-y-3 text-black">
              <i className="fa-solid fa-chevron-down"></i>
            </span>
          </div>
          <input
            type="number"
            className="w-full rounded border border-2 px-3 py-2 text-right"
            value={toAmount}
            min={0}
            onChange={handleToAmountChange}
          />
        </div>
      </div>

      <div className="mt-4 flex-col items-center justify-between gap-2 text-xs md:flex-row">
        <div className="flex items-center gap-2">
          <button
            className="h-8 w-auto cursor-pointer rounded-md border px-3 py-1 duration-300 hover:bg-yellow-500 hover:text-white"
            onClick={handleManualUpdate}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                更新中...
                <span className="fa-solid fa-spinner animate-spin"></span>
              </div>
            ) : (
              <div>
                刷新 <span className="fa-solid fa-cloud-arrow-up"></span>
              </div>
            )}
          </button>
          <div className="text-gray-700 underline">
            {lastUpdated && <span>最後更新匯率時間：{lastUpdated}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
