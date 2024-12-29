import React, { useState } from 'react';
import { Trade } from '../../../../../types/trade';
import { useUserStore } from '../../../../../store/userStore';
import { BalanceDetailsWindow } from '../../../../common/BalanceDetailsWindow';

interface TradeStatsProps {
  trades: Trade[];
}

export const TradeStats: React.FC<TradeStatsProps> = ({ trades }) => {
  const [showVolumeDetails, setShowVolumeDetails] = useState(false);
  const { settings } = useUserStore();
  
  const totalTrades = trades.length;
  const buyTrades = trades.filter(t => t.isBuyer).length;
  const sellTrades = totalTrades - buyTrades;
  
  const totalVolume = trades.reduce((sum, trade) => 
    sum + parseFloat(trade.quoteQuantity), 0
  );

  return (
    <>
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="bg-gray-800 p-4 rounded">
          <div className="text-theme text-sm mb-1">Total Trades</div>
          <div className="text-white text-lg">{totalTrades}</div>
        </div>
        <div className="bg-gray-800 p-4 rounded">
          <div className="text-theme text-sm mb-1">Buy Orders</div>
          <div className="text-green-500 text-lg">{buyTrades}</div>
        </div>
        <div className="bg-gray-800 p-4 rounded">
          <div className="text-theme text-sm mb-1">Sell Orders</div>
          <div className="text-red-500 text-lg">{sellTrades}</div>
        </div>
        <div 
          className="bg-gray-800 p-4 rounded cursor-pointer hover:bg-gray-700 transition-colors"
          onClick={() => setShowVolumeDetails(true)}
        >
          <div className="text-theme text-sm mb-1">Volume (USDT)</div>
          <div className="text-white text-base truncate">
            {settings.maskSettings.volumeMask ? "******.**" : `$${totalVolume.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
          </div>
        </div>
      </div>

      {showVolumeDetails && (
        <BalanceDetailsWindow
          amount={totalVolume}
          title="Volume Details"
          onClose={() => setShowVolumeDetails(false)}
          maskType="volumeMask"
        />
      )}
    </>
  );
};