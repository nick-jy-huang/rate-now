import React from 'react';
import CountUp from 'react-countup';
import { SYMBOLS } from '@/constants';

interface RateDisplayProps {
  from: string;
  to: string;
  rate: number | null;
  error?: string;
  className?: string;
}

const RateDisplay: React.FC<RateDisplayProps> = ({ from, to, rate, error }) => (
  <div className="text-xl font-bold">
    {!error ? (
      <div className="flex items-center gap-2">
        <h1>{SYMBOLS[from]}</h1>
        <CountUp end={1} decimals={1} duration={0.5} preserveValue />
        <h1 className="text-sm">({from})</h1> ≈ <h1> {SYMBOLS[to]}</h1>
        <h1 className="text-green-600">
          <CountUp end={rate ?? 0} decimals={4} duration={0.6} preserveValue />
        </h1>
        <h1 className="text-sm">({to})</h1>
      </div>
    ) : (
      <div className="text-red-500">{error}</div>
    )}
  </div>
);

export default RateDisplay;
