import { useState, useEffect } from 'react';
import { useTradingStore } from '../../../../../store/tradingStore';

export const usePriceUpdates = (symbol: string) => {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const { fetchPrice } = useTradingStore();

  useEffect(() => {
    const loadPrice = async () => {
      await fetchPrice(symbol);
      if (isInitialLoading) {
        setIsInitialLoading(false);
      }
    };

    loadPrice();
    const interval = setInterval(loadPrice, 1000);
    
    return () => clearInterval(interval);
  }, [symbol, fetchPrice, isInitialLoading]);

  return { isInitialLoading };
};