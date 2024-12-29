import { RefObject, useCallback, useEffect } from 'react';
import { IChartApi, ISeriesApi } from 'lightweight-charts';
import { useMarketStore } from '../../../../../store/marketStore';
import { fetchCandlestickData } from '../../../../../services/chartService';

export const useChartData = (chartRef: RefObject<IChartApi>) => {
  const { currentSymbol } = useMarketStore();

  const loadData = useCallback(async (series: ISeriesApi<"Candlestick">) => {
    try {
      const data = await fetchCandlestickData(currentSymbol);
      if (data && data.length > 0) {
        series.setData(data);
        
        // Set visible range to last 100 candles
        const timeScale = chartRef.current?.timeScale();
        if (timeScale) {
          const lastIndex = data.length - 1;
          const firstVisibleIndex = Math.max(0, lastIndex - 100);
          timeScale.setVisibleRange({
            from: data[firstVisibleIndex].time as number,
            to: data[lastIndex].time as number,
          });
        }
      }
    } catch (error) {
      console.error('Failed to load chart data:', error);
    }
  }, [currentSymbol, chartRef]);

  return { loadData };
};