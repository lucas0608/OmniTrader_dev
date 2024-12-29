import React, { useState, useEffect } from 'react';
import { useMarketStore } from '../../../store/marketStore';
import { useUserStore } from '../../../store/userStore';
import { CryptoSelector } from './CryptoSelector';
import { MarketDataModal } from './MarketDataModal';
import { ConnectionStatus } from './ConnectionStatus';
import { useWebSocket } from '../../../hooks/useWebSocket';
import { formatPrice, formatCompactNumber } from '../../../utils/formatters';

export const MarketInfo: React.FC = () => {
  const [showSelector, setShowSelector] = useState(false);
  const [showMarketData, setShowMarketData] = useState(false);
  const { currentSymbol, marketData, fetchMarketData, setCurrentSymbol } = useMarketStore();
  const { settings } = useUserStore();
  const { status } = useWebSocket(currentSymbol);

  const displaySymbol = currentSymbol.replace(/^([A-Za-z]+)(USDT)$/, '$1/$2');

  useEffect(() => {
    fetchMarketData(currentSymbol);
    if (settings.dataMethod === 'polling') {
      const interval = setInterval(() => {
        fetchMarketData(currentSymbol);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [currentSymbol, settings.dataMethod, settings.priceSource]);

  const lastUpdateTime = marketData?.timestamp 
    ? new Date(marketData.timestamp).toLocaleString()
    : 'N/A';

  const priceChangeColor = marketData?.change24h > 0 ? 'text-green-500' : 
                          marketData?.change24h < 0 ? 'text-red-500' : 
                          'text-white';

  const handleRefresh = () => {
    fetchMarketData(currentSymbol);
  };

  return (
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div 
        className="bg-[#1a1a1a] border border-theme p-3 cursor-pointer relative h-[140px]"
        onClick={() => setShowSelector(true)}
      >
        <div className="font-mono">
          <span className={`text-xs sm:text-sm ${priceChangeColor}`}>{displaySymbol}</span>
          <div className={`text-lg sm:text-2xl mt-1 ${priceChangeColor}`}>
            ${marketData?.price ? formatPrice(marketData.price) : '0.00'}
          </div>
          {marketData && (
            <div className={`text-xs sm:text-sm mt-1 ${priceChangeColor}`}>
              {marketData.change24h >= 0 ? '+' : ''}{marketData.change24h.toFixed(2)}%
            </div>
          )}
        </div>
        
        <div className="absolute bottom-2 left-3 text-gray-400 text-[10px] sm:text-xs">
          Last update: {lastUpdateTime}
        </div>

        <div className="absolute top-2 right-2 flex items-center gap-2">
          {settings.dataMethod === 'streaming' && (
            <ConnectionStatus status={status} />
          )}
          <div className="text-[10px] sm:text-xs text-gray-400">
            {settings.priceSource.binance ? 'Binance' : 'CoinCap'}
          </div>
        </div>

        <button 
          onClick={(e) => {
            e.stopPropagation();
            handleRefresh();
          }}
          className="absolute bottom-2 right-2 text-theme hover:text-theme/80 p-1 transition-colors"
          title="Refresh Price"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
      
      {/* Rest of the component remains the same */}
      <div 
        className="bg-[#1a1a1a] border border-theme p-3 h-[140px] cursor-pointer"
        onClick={() => setShowMarketData(true)}
      >
        <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-white font-mono text-sm h-full">
          <div>H ${marketData?.high ? formatPrice(marketData.high) : '0.00'}</div>
          <div>L ${marketData?.low ? formatPrice(marketData.low) : '0.00'}</div>
          <div>Vol ${marketData?.volume24h ? formatCompactNumber(marketData.volume24h / 1e9) : '0.00'}B</div>
          <div>MCap ${marketData?.marketCap ? formatCompactNumber(marketData.marketCap / 1e9) : '0.00'}B</div>
        </div>
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

      {showMarketData && marketData && (
        <MarketDataModal
          symbol={currentSymbol}
          onClose={() => setShowMarketData(false)}
        />
      )}
    </div>
  );
};