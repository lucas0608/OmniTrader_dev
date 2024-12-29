import { RefObject, useCallback } from 'react';
import { IChartApi } from 'lightweight-charts';

export const useChartResize = (
  containerRef: RefObject<HTMLDivElement>,
  chartRef: RefObject<IChartApi>
) => {
  const handleResize = useCallback(() => {
    if (containerRef.current && chartRef.current) {
      chartRef.current.applyOptions({ 
        width: containerRef.current.clientWidth 
      });
    }
  }, []);

  return { handleResize };
};