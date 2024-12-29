import { useRef, useEffect } from 'react';
import { createChart, IChartApi } from 'lightweight-charts';
import { chartConfig } from '../../../../../config/chartConfig';

export const useChart = (containerRef: React.RefObject<HTMLDivElement>) => {
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!containerRef.current || chartRef.current) return;

    chartRef.current = createChart(containerRef.current, {
      ...chartConfig,
      width: containerRef.current.clientWidth,
      height: 140,
      layout: {
        ...chartConfig.layout,
        fontSize: 10
      }
    });

    const handleResize = () => {
      if (containerRef.current && chartRef.current) {
        chartRef.current.applyOptions({ 
          width: containerRef.current.clientWidth 
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, []);

  return chartRef;
};