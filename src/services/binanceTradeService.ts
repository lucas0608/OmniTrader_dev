import axios from 'axios';
import { Trade } from '../types/trade';

const BASE_URL = 'https://api.binance.com/api/v3';

export const BinanceTradeService = {
  async getRecentTrades(symbol: string): Promise<Trade[]> {
    try {
      const response = await axios.get(`${BASE_URL}/trades`, {
        params: {
          symbol,
          limit: 50
        }
      });
      
      return response.data.map((trade: any) => ({
        id: trade.id,
        symbol,
        price: trade.price,
        quantity: trade.qty,
        quoteQuantity: (parseFloat(trade.price) * parseFloat(trade.qty)).toString(),
        time: trade.time,
        isBuyer: trade.isBuyerMaker,
        isMaker: trade.isMaker,
        commission: '0',
        commissionAsset: 'USDT'
      }));
    } catch (error) {
      console.error('Error fetching trades:', error);
      throw new Error('Failed to fetch trades');
    }
  }
};