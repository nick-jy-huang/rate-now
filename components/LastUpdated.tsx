import React from 'react';

interface LastUpdatedProps {
  time?: string;
}

const LastUpdated: React.FC<LastUpdatedProps> = ({ time }) => (
  <div className="text-center text-gray-700 underline">
    <span>最後更新匯率時間： {time || '- -'}</span>
  </div>
);

export default LastUpdated;
