import React from 'react';

export const RecordTab = () => {
  const records = [
    { time: '14:30:22', type: 'BUY', price: 42_568.50, status: '+80', statusColor: 'text-green-500' },
    { time: '14:25:15', type: 'SELL', price: 42_498.75, status: '-35', statusColor: 'text-red-500' },
    { time: '14:20:08', type: 'BUY', price: 42_550.25, status: '+120', statusColor: 'text-green-500' }
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-2 text-theme text-sm">
        <div>TIME</div>
        <div>TYPE</div>
        <div>PRICE</div>
        <div>STATUS</div>
      </div>
      
      {records.map((record, index) => (
        <div key={index} className="grid grid-cols-4 gap-2 text-white text-sm border-b border-gray-700 pb-2">
          <div>{record.time}</div>
          <div className={record.type === 'BUY' ? 'text-green-500' : 'text-red-500'}>
            {record.type}
          </div>
          <div>${record.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          <div className={record.statusColor}>{record.status}</div>
        </div>
      ))}
    </div>
  );
};