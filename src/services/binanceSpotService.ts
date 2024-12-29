import axios from 'axios';

const BASE_URL = 'https://api.binance.com/api/v3';

interface OrderBookData {
  lastUpdateId: number;
  bids: Array<[string, string]>;
  asks: Array<[string, string]>;
}

const binanceApi = axios.create({
  baseURL: BASE_URL,
  timeout: 5000
});

export const BinanceSpotService = {
  async getPrice(symbol: string): Promise<number> {
    try {
      const response = await binanceApi.get('/ticker/price', {
        params: { symbol }
      });
      
      if (!response.data || typeof response.data.price !== 'string') {
        throw new Error('Invalid price data received');
      }
      
      const price = parseFloat(response.data.price);
      if (isNaN(price)) {
        throw new Error('Invalid price format');
      }
      
      return price;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error fetching price:', error.message);
      } else {
        console.error('Unknown error fetching price');
      }
      return 0;
    }
  },

  async getOrderBook(symbol: string, limit: number = 5): Promise<OrderBookData> {
    try {
      const response = await binanceApi.get('/depth', {
        params: {
          symbol,
          limit
        }
      });

      if (!response.data || !Array.isArray(response.data.bids) || !Array.isArray(response.data.asks)) {
        throw new Error('Invalid order book data received');
      }

      return {
        lastUpdateId: response.data.lastUpdateId,
        bids: response.data.bids.map((bid: [string, string]) => [
          bid[0],
          bid[1]
        ]),
        asks: response.data.asks.map((ask: [string, string]) => [
          ask[0],
          ask[1]
        ])
      };
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error fetching order book:', error.message);
      } else {
        console.error('Unknown error fetching order book');
      }
      throw new Error('Failed to fetch order book');
    }
  }
};