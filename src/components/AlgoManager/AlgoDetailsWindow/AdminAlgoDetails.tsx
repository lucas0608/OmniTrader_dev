import React from 'react';
import { ManagedAlgo } from '../../../types/algo';
import { useTradingStore } from '../../../store/tradingStore';

interface AdminAlgoDetailsProps {
  algo: ManagedAlgo;
  onClose: () => void;
}

export const AdminAlgoDetails: React.FC<AdminAlgoDetailsProps> = ({ algo }) => {
  const { positions } = useTradingStore();

  return (
    <div className="space-y-4">
      <div className="bg-gray-800 p-4 rounded">
        <h3 className="text-theme text-sm mb-2">Current Positions</h3>
        {positions.length > 0 ? (
          <div className="space-y-2">
            {positions.map((position, index) => (
              <div key={index} className="grid grid-cols-3 text-white text-sm">
                <span>{position.symbol}</span>
                <span className="text-center">{position.amount}</span>
                <span className={`text-right ${position.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {position.pnl >= 0 ? '+' : ''}{position.pnl}%
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-400 text-sm">No active positions</div>
        )}
      </div>

      <button
        onClick={() => {
          // TODO: Implement close all positions logic
          console.log('Closing all positions...');
        }}
        className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
      >
        Close All Positions
      </button>
    </div>
  );
};