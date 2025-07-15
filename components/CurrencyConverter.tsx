import React, { useEffect, useState } from 'react';

const CURRENCIES = [
  { code: 'USD', name: '美元' },
  { code: 'EUR', name: '歐元' },
  { code: 'JPY', name: '日圓' },
  { code: 'TWD', name: '新台幣' },
  { code: 'HKD', name: '港幣' },
  { code: 'GBP', name: '英鎊' },
  { code: 'AUD', name: '澳幣' },
  { code: 'CAD', name: '加幣' },
  { code: 'SGD', name: '新幣' },
  { code: 'CNY', name: '人民幣' },
];

function formatNumber(n: number) {
  return n.toLocaleString(undefined, {
    maximumFractionDigits: 4,
  });
}

export default function CurrencyConverter() {
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('TWD');
  const [fromAmount, setFromAmount] = useState(1);
  const [toAmount, setToAmount] = useState(0);
  const [rate, setRate] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchRate = async (f = from, t = to) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/rates?from=${f}&to=${t}`);
      const data = await res.json();
      if (data.rate) {
        setRate(data.rate);
        setToAmount(Number((fromAmount * data.rate).toFixed(4)));
        setLastUpdated(data.lastUpdated ? new Date(data.lastUpdated).toLocaleString() : 'None');
      } else {
        setRate(null);
        setToAmount(0);
        setError('Currency not found');
      }
    } catch (e) {
      setError('API connected failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRate();
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
      await fetchRate();
    } catch (e) {
      setError('API 連線失敗');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6 rounded-xl bg-white p-8 shadow-lg">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex flex-1 flex-col items-center">
          <select
            className="mb-2 w-full rounded border px-3 py-2"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} - {c.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            className="w-full rounded border px-3 py-2 text-right"
            value={fromAmount}
            min={0}
            onChange={handleFromAmountChange}
          />
        </div>

        <button
          className="m-4 cursor-pointer content-center text-xl text-gray-600 duration-300 hover:scale-125 hover:border-blue-500 hover:text-blue-500"
          onClick={handleSwap}
          title="交換幣別"
        >
          <span className="fa-solid fa-right-left"></span>
        </button>

        <div className="flex flex-1 flex-col items-center">
          <select
            className="mb-2 w-full rounded border px-3 py-2"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} - {c.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            className="w-full rounded border px-3 py-2 text-right"
            value={toAmount}
            min={0}
            onChange={handleToAmountChange}
          />
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-2 text-sm text-gray-600 md:flex-row">
        <div>
          {rate !== null && !error && (
            <span>
              1 {from} ≈ <span className="font-bold text-blue-600">{formatNumber(rate)}</span> {to}
            </span>
          )}
          {error && <span className="text-red-500">{error}</span>}
        </div>
        <div className="flex items-center gap-2">
          <button
            className="tex-md cursor-pointer rounded border px-3 py-1 duration-300 hover:bg-blue-600 hover:text-white"
            onClick={handleManualUpdate}
            disabled={loading}
          >
            {loading ? '更新中...' : '手動更新'}
          </button>
          {lastUpdated && <span>最後更新：{lastUpdated}</span>}
        </div>
      </div>
    </div>
  );
}
