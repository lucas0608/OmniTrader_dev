import { RefObject } from 'react';
import { createChart, IChartApi, ISeriesApi, CandlestickSeriesOptions } from 'lightweight-charts';
import { chartConfig } from '../../../../../config/chartConfig';

export const useChartSetup = (
  containerRef: RefObject<HTMLDivElement>,
  chartRef: RefObject<IChartApi>
) => {
  const setupChart = () => {
    if (!containerRef.current) return;

    chartRef.current = createChart(containerRef.current, {
      ...chartConfig,
      width: containerRef.current.clientWidth,
      height: 600
    });

    return setupSeries();
  };

  const setupSeries = () => {
    if (!chartRef.current) return;

    const seriesOptions: CandlestickSeriesOptions = {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350'
    };

    return chartRef.current.addCandlestickSeries(seriesOptions);
  };

  return { setupChart, setupSeries };
};