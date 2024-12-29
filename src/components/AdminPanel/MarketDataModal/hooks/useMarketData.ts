import { useState, useEffect, useCallback } from 'react';
import { fetchDetailedMarketData } from '../../../../services/cryptoService';
import { MarketDataType } from '../../../../types/market';

export const useMarketData = (symbol: string) => {
  const [data, setData] = useState<MarketDataType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const marketData = await fetchDetailedMarketData(symbol);
      setData(marketData);
    } catch (err) {
      setError('Failed to load market data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [symbol]);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, [loadData]);

  return { data, isLoading, error };
};