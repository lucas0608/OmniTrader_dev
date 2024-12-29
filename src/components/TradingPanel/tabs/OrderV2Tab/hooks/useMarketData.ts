import { useEffect } from 'react';
import { useMarketStore } from '../../../../../store/marketStore';
import { useTradingStore } from '../../../../../store/tradingStore';
import { useUserStore } from '../../../../../store/userStore';

export const useMarketData = () => {
  const { currentSymbol } = useMarketStore();
  const { fetchPrice, fetchOrderBook, startDataStream, stopDataStream } = useTradingStore();
  const { settings } = useUserStore();

  useEffect(() => {
    let priceInterval: NodeJS.Timer;
    let orderBookInterval: NodeJS.Timer;

    if (settings.dataMethod === 'streaming') {
      startDataStream(currentSymbol);
    } else {
      priceInterval = setInterval(() => fetchPrice(currentSymbol), 1000);
      orderBookInterval = setInterval(() => fetchOrderBook(currentSymbol), 1000);
    }

    return () => {
      if (settings.dataMethod === 'streaming') {
        stopDataStream();
      } else {
        clearInterval(priceInterval);
        clearInterval(orderBookInterval);
      }
    };
  }, [currentSymbol, settings.dataMethod]);
};