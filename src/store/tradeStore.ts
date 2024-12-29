import { create } from 'zustand';
import { Trade, TradeHistory } from '../types/trade';
import { BinanceTradeService } from '../services/binanceTradeService';

interface TradeStore extends TradeHistory {
  fetchTrades: (symbol: string) => Promise<void>;
}

export const useTradeStore = create<TradeStore>((set) => ({
  trades: [],
  isLoading: false,
  error: null,

  fetchTrades: async (symbol: string) => {
    try {
      set({ isLoading: true, error: null });
      const trades = await BinanceTradeService.getRecentTrades(symbol);
      set({ trades, isLoading: false });
    } catch (error) {
      set({ 
        error: 'Failed to fetch trades',
        isLoading: false 
      });
    }
  }
}));