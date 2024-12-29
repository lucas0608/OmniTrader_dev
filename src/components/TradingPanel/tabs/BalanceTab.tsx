import React from 'react';

export const BalanceTab = () => {
  const totalBalance = 128450;
  const currentPosition = 30000;
  const positionPercentage = (currentPosition / totalBalance) * 100;

  return (
    <div className="space-y-4">
      <div className="bg-gray-800 p-4 rounded flex justify-between items-center">
        <div>
          <div className="text-theme text-sm mb-1">Total Balance</div>
          <div className="text-white text-lg">$128,450.00</div>
        </div>
        <div className="w-20 h-20 relative">
          <svg viewBox="0 0 36 36" className="w-full h-full">
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#444"
              strokeWidth="3"
            />
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="var(--primary-color)"
              strokeWidth="3"
              strokeDasharray={`${positionPercentage}, 100`}
            />
            <text
              x="50%"
              y="50%"
              dominantBaseline="middle"
              textAnchor="middle"
              className="fill-white text-xs"
            >
              {positionPercentage.toFixed(0)}%
            </text>
          </svg>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800 p-4 rounded">
          <div className="text-theme text-sm">Profit/Loss</div>
          <div className="text-green-500 text-lg">+$2,450.00</div>
        </div>
        <div className="bg-gray-800 p-4 rounded">
          <div className="text-theme text-sm">Available</div>
          <div className="text-white text-lg">$98,450.00</div>
        </div>
      </div>
    </div>
  );
};