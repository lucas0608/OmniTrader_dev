import React from 'react';
import { Trade } from '../../../../../types/trade';
import { formatPrice } from '../../../../../utils/formatters';

interface TradeListProps {
  trades: Trade[];
}

export const TradeList: React.FC<TradeListProps> = ({ trades }) => (
  <div className="w-full">
    <table className="w-full text-xs">
      <thead className="sticky top-0 bg-gray-800 z-10">
        <tr className="text-theme border-b border-gray-700">
          <th className="py-1.5 px-2 text-left">Time</th>
          <th className="py-1.5 px-2 text-left">Type</th>
          <th className="py-1.5 px-2 text-right">Price</th>
          <th className="py-1.5 px-2 text-right">Amount</th>
          <th className="py-1.5 px-2 text-right">Total</th>
        </tr>
      </thead>
      <tbody>
        {trades.map((trade, index) => (
          <tr 
            key={trade.id} 
            className={`${
              index % 2 === 0 ? 'bg-[#1F2937]' : 'bg-[#111827]'
            } hover:bg-gray-700 transition-colors`}
          >
            <td className="py-1.5 px-2 text-white">
              {new Date(trade.time).toLocaleTimeString()}
            </td>
            <td className={`py-1.5 px-2 ${trade.isBuyer ? 'text-green-500' : 'text-red-500'}`}>
              {trade.isBuyer ? 'BUY' : 'SELL'}
            </td>
            <td className="py-1.5 px-2 text-white text-right">
              ${formatPrice(parseFloat(trade.price))}
            </td>
            <td className="py-1.5 px-2 text-white text-right">
              {parseFloat(trade.quantity).toFixed(4)}
            </td>
            <td className="py-1.5 px-2 text-white text-right">
              ${formatPrice(parseFloat(trade.quoteQuantity))}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);