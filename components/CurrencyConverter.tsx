import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { CURRENCY_NAME_MAP } from '@/constants';
import CurrencySelect from './prototype/CurrencySelect';
import AmountInput from './prototype/AmountInput';
import RateDisplay from './prototype/RateDisplay';
import SwapButton from './prototype/SwapButton';
import UpdateButton from './prototype/UpdateButton';
import Ribbon from './prototype/Ribbon';
import LastUpdated from './prototype/LastUpdated';

const apiConnectedFailed = 'API connected failed';

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
      setError(apiConnectedFailed);
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
      setError(apiConnectedFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex w-full flex-col items-center gap-4 rounded-xl border-2 bg-white p-8 shadow-lg sm:w-2/3 md:w-2/3 lg:w-1/2 xl:w-1/3">
      <Ribbon href="https://tw.rter.info">資料來源</Ribbon>
      <img
        src="/icon-192.png"
        alt="logo"
        className="h-24 w-24 duration-200 hover:scale-120 hover:rotate-180"
      />

      <h1 className="text-center text-3xl font-bold">Rate Now</h1>

      <RateDisplay from={from} to={to} rate={rate} error={error} />

      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex flex-1 flex-col items-center">
          <CurrencySelect
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            options={currencies}
            getOptionLabel={(code) =>
              `${code} - ${CURRENCY_NAME_MAP[code] || code}`
            }
          />
          <AmountInput value={fromAmount} onChange={handleFromAmountChange} />
        </div>

        <SwapButton onClick={handleSwap} />

        <div className="flex flex-col items-center">
          <CurrencySelect
            value={to}
            onChange={(e) => setTo(e.target.value)}
            options={currencies}
            getOptionLabel={(code) =>
              `${code} - ${CURRENCY_NAME_MAP[code] || code}`
            }
          />
          <AmountInput value={toAmount} onChange={handleToAmountChange} />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
        <UpdateButton loading={loading} onClick={handleManualUpdate} />
        <LastUpdated time={lastUpdated} />
      </div>
    </div>
  );
}
