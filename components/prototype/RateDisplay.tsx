import React from 'react';
import CountUp from 'react-countup';

interface RateDisplayProps {
  from: string;
  to: string;
  rate: number | null;
  error?: string;
  className?: string;
}

const RateDisplay: React.FC<RateDisplayProps> = ({ from, to, rate, error, className }) => (
  <h1 className={`text-xl font-bold text-black ${className || ''}`}>
    {!error ? (
      <div className="flex items-center gap-2">
        <span className="flex gap-2.5">
          <CountUp end={1} decimals={1} duration={0.5} preserveValue />
          <span>{from}</span> ≈
          <span className="font-bold text-green-600">
            <CountUp end={rate ?? 0} decimals={4} duration={0.6} preserveValue />
          </span>
          <span>{to}</span>
        </span>
      </div>
    ) : (
      <span className="text-red-500">{error}</span>
    )}
  </h1>
);

export default RateDisplay; 