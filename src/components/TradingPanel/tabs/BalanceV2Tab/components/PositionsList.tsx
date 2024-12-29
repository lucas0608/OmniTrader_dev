import React from 'react';
import { Position } from '../../../../../types/balance';
import { formatCryptoAmount } from '../../../../../utils/formatters';

interface PositionsListProps {
  positions: Position[];
}

export const PositionsList: React.FC<PositionsListProps> = ({ positions }) => (
  <div className="bg-gray-800 rounded-lg">
    <table className="w-full text-sm">
      <thead className="bg-gray-700">
        <tr className="text-theme">
          <th className="py-2 px-4 text-left">Asset</th>
          <th className="py-2 px-4 text-right">Total</th>
          <th className="py-2 px-4 text-right">Available</th>
          <th className="py-2 px-4 text-right">In Order</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-700">
        {positions.map((position) => (
          <tr key={position.asset} className="hover:bg-gray-700">
            <td className="py-2 px-4 text-white">{position.asset}</td>
            <td className="py-2 px-4 text-right text-white">
              {formatCryptoAmount(position.total, position.asset)}
            </td>
            <td className="py-2 px-4 text-right text-white">
              {formatCryptoAmount(position.free, position.asset)}
            </td>
            <td className="py-2 px-4 text-right text-white">
              {formatCryptoAmount(position.locked, position.asset)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);