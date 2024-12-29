import { CandlestickData } from '../services/chartService';

export const formatChartData = (data: any[]): CandlestickData[] => {
  return data.map(([timestamp, open, high, low, close]) => ({
    time: timestamp / 1000,
    open: parseFloat(open),
    high: parseFloat(high),
    low: parseFloat(low),
    close: parseFloat(close)
  }));
};