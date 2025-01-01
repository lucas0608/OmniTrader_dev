import { useEffect } from 'react';
import { usePanelStore } from '../store/panelStore';
import { useMarketStore } from '../store/marketStore';
import { useTradingStore } from '../store/tradingStore';
import { useTradeStore } from '../store/tradeStore';

export const usePanelData = (setId: number = 0) => {
  const { panelData, updatePanelData } = usePanelStore();
  const { fetchMarketData } = useMarketStore();
  const { fetchOrderBook } = useTradingStore();
  const { fetchTrades } = useTradeStore();

  const setData = panelData[setId] || panelData[0];

  useEffect(() => {
    const loadData = async () => {
      try {
        const [marketData, orderBook, trades] = await Promise.all([
          fetchMarketData(setData.symbol),
          fetchOrderBook(setData.symbol),
          fetchTrades(setData.symbol)
        ]);

        updatePanelData(setId, {
          marketData,
          orderBook,
          trades
        });
      } catch (error) {
        console.error(`Error loading data for set ${setId}:`, error);
      }
    };

    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, [setId, setData.symbol]);

  return {
    data: setData,
    updateSymbol: (symbol: string) => updatePanelData(setId, { symbol })
  };
};