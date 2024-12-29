import React, { useState, useEffect } from 'react';
import { useTradingStore } from '../../../../../store/tradingStore';
import { useMarketStore } from '../../../../../store/marketStore';
import { LoadingSpinner } from '../../../../common/LoadingSpinner';
import { CryptoSelector } from '../../../../AdminPanel/CryptoSelector';
import { usePriceUpdates } from '../hooks/usePriceUpdates';

export const MarketInfo = () => {
  const { currentSymbol, setCurrentSymbol } = useMarketStore();
  const { currentPrice } = useTradingStore();
  const [showSelector, setShowSelector] = useState(false);
  const { isInitialLoading } = usePriceUpdates(currentSymbol);

  return (
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div className="bg-gray-800 p-4 rounded">
        <div className="text-theme text-sm mb-2">Current Price</div>
        {isInitialLoading ? (
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="text-2xl text-white">
            ${currentPrice?.toFixed(2) || '0.00'}
          </div>
        )}
      </div>
      <div 
        className="bg-gray-800 p-4 rounded cursor-pointer hover:bg-gray-700 transition-colors"
        onClick={() => setShowSelector(true)}
      >
        <div className="text-theme text-sm mb-2">Trading Pair</div>
        <div className="text-2xl text-white">{currentSymbol}</div>
      </div>

      {showSelector && (
        <CryptoSelector 
          onSelect={(symbol) => {
            setCurrentSymbol(`${symbol}USDT`);
            setShowSelector(false);
          }}
          onClose={() => setShowSelector(false)}
        />
      )}
    </div>
  );
};