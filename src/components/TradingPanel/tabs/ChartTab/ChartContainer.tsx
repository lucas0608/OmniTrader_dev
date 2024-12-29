import React, { useRef, useEffect } from 'react';
import { useChart } from './hooks/useChart';
import { useMarketStore } from '../../../../store/marketStore';
import { fetchCandlestickData } from '../../../../services/chartService';
import { LoadingSpinner } from '../../../common/LoadingSpinner';
import '../../../../styles/scrollbar.css';

export const ChartContainer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useChart(containerRef);
  const { currentSymbol } = useMarketStore();
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!chartRef.current) return;

      try {
        setIsLoading(true);
        const data = await fetchCandlestickData(currentSymbol);
        
        if (chartRef.current) {
          const series = chartRef.current.addCandlestickSeries({
            upColor: '#26a69a',
            downColor: '#ef5350',
            borderVisible: false,
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350'
          });
          
          series.setData(data);
          chartRef.current.timeScale().fitContent();
        }
      } catch (err) {
        setError('Failed to load chart data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [currentSymbol]);

  if (error) {
    return (
      <div className="h-[140px] flex items-center justify-center bg-[#1a1a1a] rounded-lg">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="relative h-[140px]">
      <div 
        ref={containerRef} 
        className="w-full h-full bg-[#1a1a1a] rounded-lg overflow-hidden custom-scrollbar"
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
};