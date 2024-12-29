import { binanceApi } from './api/binanceApi';
import { formatChartData } from '../utils/chartFormatters';
import { CandlestickData } from '../types/chart';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchCandlestickData = async (
  symbol: string, 
  retryCount = 0
): Promise<CandlestickData[]> => {
  try {
    const response = await binanceApi.get('/klines', {
      params: {
        symbol,
        interval: '1h',
        limit: 1000
      }
    });

    if (!response.data || !Array.isArray(response.data)) {
      throw new Error('Invalid data format received from API');
    }

    return formatChartData(response.data);
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      await delay(RETRY_DELAY * (retryCount + 1));
      return fetchCandlestickData(symbol, retryCount + 1);
    }
    console.error('Failed to fetch candlestick data:', error);
    return [];
  }
};