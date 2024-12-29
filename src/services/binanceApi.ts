import axios from 'axios';
import { MarketData } from '../types/market';

const BINANCE_API_BASE = 'https://api.binance.com/api/v3';

export class BinanceApiService {
  static async getMarketData(symbol: string): Promise<MarketData> {
    try {
      const [tickerResponse, klineResponse] = await Promise.all([
        axios.get(`${BINANCE_API_BASE}/ticker/24hr`, { params: { symbol } }),
        axios.get(`${BINANCE_API_BASE}/klines`, {
          params: {
            symbol,
            interval: '1d',
            limit: 1
          }
        })
      ]);

      const ticker = tickerResponse.data;
      const change24h = parseFloat(((parseFloat(ticker.lastPrice) - parseFloat(ticker.openPrice)) / parseFloat(ticker.openPrice) * 100).toFixed(2));

      return {
        symbol,
        price: parseFloat(ticker.lastPrice),
        high: parseFloat(ticker.highPrice),
        low: parseFloat(ticker.lowPrice),
        change24h,
        volume24h: parseFloat(ticker.volume),
        marketCap: parseFloat(ticker.quoteVolume),
        timestamp: ticker.closeTime
      };
    } catch (error) {
      console.error('Error fetching market data:', error);
      throw error;
    }
  }
}