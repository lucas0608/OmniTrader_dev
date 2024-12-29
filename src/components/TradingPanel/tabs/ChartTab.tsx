import React, { useEffect, useRef } from 'react';
import { createChart, IChartApi } from 'lightweight-charts';
import { useMarketStore } from '../../../store/marketStore';
import { fetchCandlestickData } from '../../../services/chartService';
import { chartConfig } from '../../../config/chartConfig';

export const ChartTab = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi>();
  const { currentSymbol } = useMarketStore();

  useEffect(() => {
    if (!chartContainerRef.current) return;

    chartRef.current = createChart(chartContainerRef.current, {
      ...chartConfig,
      width: chartContainerRef.current.clientWidth,
      height: 600
    });

    const candlestickSeries = chartRef.current.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350'
    });

    const loadChartData = async () => {
      const data = await fetchCandlestickData(currentSymbol);
      if (data.length > 0) {
        candlestickSeries.setData(data);
      }
    };

    loadChartData();

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({ 
          width: chartContainerRef.current.clientWidth 
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, [currentSymbol]);

  return (
    <div 
      ref={chartContainerRef} 
      className="w-full bg-[#1a1a1a] rounded-lg overflow-hidden"
    />
  );
};