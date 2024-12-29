import React, { useState } from 'react';
import { useMarketStore } from '../../../store/marketStore';
import { CryptoSelector } from '../../AdminPanel/CryptoSelector';

export const PriceDisplay = () => {
  const { currentSymbol, setCurrentSymbol, marketData } = useMarketStore();
  const [showSelector, setShowSelector] = useState(false);

  const handleCryptoSelect = (symbol: string) => {
    setCurrentSymbol(`${symbol}USDT`);
    setShowSelector(false);
  };

  return (
    <>
      <div className="bg-gray-800 p-2 sm:p-3 rounded">
        <div className="text-theme text-[10px] sm:text-xs mb-0.5 sm:mb-1">Current Price</div>
        <div className="text-white text-base sm:text-lg font-mono truncate">
          ${marketData?.price?.toFixed(2) || '0.00'}
        </div>
      </div>
      <div 
        className="bg-gray-800 p-2 sm:p-3 rounded cursor-pointer hover:bg-gray-700 transition-colors"
        onClick={() => setShowSelector(true)}
      >
        <div className="text-theme text-[10px] sm:text-xs mb-0.5 sm:mb-1">Trading Pair</div>
        <div className="text-white text-base sm:text-lg font-mono truncate">{currentSymbol}</div>
      </div>

      {showSelector && (
        <CryptoSelector 
          onSelect={handleCryptoSelect}
          onClose={() => setShowSelector(false)}
        />
      )}
    </>
  );
};