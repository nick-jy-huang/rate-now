import React from 'react';

interface LastUpdatedProps {
  time?: string;
  className?: string;
}

const LastUpdated: React.FC<LastUpdatedProps> = ({ time, className }) => (
  <div className={`text-gray-700 underline ${className || ''}`}>
    {time && <span>最後更新匯率時間：{time}</span>}
  </div>
);

export default LastUpdated; 