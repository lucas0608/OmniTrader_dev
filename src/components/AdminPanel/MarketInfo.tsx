import React, { useState, useEffect } from 'react';
import { fetchCryptoPrice, fetchMarketData } from '../../services/cryptoService';
import { CryptoSelector } from './CryptoSelector';
import { MarketDataModal } from './MarketDataModal/MarketDataModal';
import { useMarketStore } from '../../store/marketStore';

export const MarketInfo = () => {
  const [cryptoData, setCryptoData] = useState<any>(null);
  const [showSelector, setShowSelector] = useState(false);
  const [showMarketData, setShowMarketData] = useState(false);
  const { setCurrentSymbol } = useMarketStore();

  const fetchData = async (symbol = 'BTC') => {
    try {
      const [priceData, marketData] = await Promise.all([
        fetchCryptoPrice(symbol),
        fetchMarketData(symbol)
      ]);
      setCryptoData({ ...priceData, ...marketData });
      setCurrentSymbol(`${symbol}USDT`);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(), 10000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  if (!cryptoData) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-2 gap-4 mb-4 relative">
      <button 
        onClick={handleRefresh}
        className="absolute -top-8 right-0 text-theme hover:text-theme/80 p-1 transition-colors"
        title="Refresh Page"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
      
      <div 
        className="bg-[#1a1a1a] border border-theme p-3 cursor-pointer relative h-[140px]"
        onClick={() => setShowSelector(true)}
      >
        <div className="text-[#33ff33] font-mono">
          <span className="text-sm">{cryptoData.symbol}/USDT</span>
          <div className="text-2xl mt-1">${cryptoData.price.toFixed(2)}</div>
          <div className={`text-sm mt-1 ${cryptoData.change24h >= 0 ? "text-[#33ff33]" : "text-red-500"}`}>
            {cryptoData.change24h >= 0 ? '+' : ''}{cryptoData.change24h.toFixed(2)}%
          </div>
        </div>
        <div className="text-gray-400 text-xs mt-1">
          Last update: {cryptoData.lastUpdate}
        </div>
      </div>
      <div 
        className="bg-[#1a1a1a] border border-theme p-3 h-[140px] cursor-pointer"
        onClick={() => setShowMarketData(true)}
      >
        <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-white font-mono text-sm h-full">
          <div>H ${cryptoData.high24h.toFixed(2)}</div>
          <div>L ${cryptoData.low24h.toFixed(2)}</div>
          <div>Vol ${(cryptoData.volume24h / 1e9).toFixed(2)}B</div>
          <div>MCap ${(cryptoData.marketCap / 1e9).toFixed(2)}B</div>
        </div>
      </div>

      {showSelector && (
        <CryptoSelector 
          onSelect={(symbol) => {
            fetchData(symbol);
            setShowSelector(false);
          }}
          onClose={() => setShowSelector(false)}
        />
      )}

      {showMarketData && (
        <MarketDataModal
          symbol={cryptoData.symbol}
          onClose={() => setShowMarketData(false)}
        />
      )}
    </div>
  );
};