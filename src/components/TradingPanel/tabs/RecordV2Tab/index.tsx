import React, { useEffect } from 'react';
import { useTradeStore } from '../../../../store/tradeStore';
import { useMarketStore } from '../../../../store/marketStore';
import { TradeList } from './components/TradeList';
import { TradeStats } from './components/TradeStats';
import { LoadingSpinner } from '../../../common/LoadingSpinner';
import '../../../../styles/scrollbar.css';

export const RecordV2Tab = () => {
  const { currentSymbol } = useMarketStore();
  const { trades, isLoading, error, fetchTrades } = useTradeStore();

  useEffect(() => {
    fetchTrades(currentSymbol);
    const interval = setInterval(() => fetchTrades(currentSymbol), 10000);
    return () => clearInterval(interval);
  }, [currentSymbol]);

  if (isLoading && trades.length === 0) {
    return (
      <div className="h-[140px] flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[140px] flex justify-center items-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <TradeStats trades={trades} />
      <div className="h-[140px] overflow-y-auto bg-gray-800 rounded-lg custom-scrollbar">
        <TradeList trades={trades} />
      </div>
    </div>
  );
};