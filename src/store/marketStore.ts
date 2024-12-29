import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MarketData } from '../types/market';
import { BinanceApiService } from '../services/binanceApi';
import { CoinCapService } from '../services/cryptoService';
import { useUserStore } from './userStore';

export const useMarketStore = create()(
  persist(
    (set) => ({
      currentSymbol: 'BTCUSDT',
      marketData: null,
      isLoading: false,
      error: null,

      setCurrentSymbol: (symbol: string) => set({ currentSymbol: symbol }),

      fetchMarketData: async (symbol: string) => {
        set({ isLoading: true });
        try {
          const { settings } = useUserStore.getState();
          const data = settings.priceSource.binance 
            ? await BinanceApiService.getMarketData(symbol)
            : await CoinCapService.getMarketData(symbol);
          set({ marketData: data, error: null });
        } catch (error) {
          set({ error: 'Failed to fetch market data' });
        } finally {
          set({ isLoading: false });
        }
      }
    }),
    {
      name: 'market-store',
      partialize: (state) => ({
        currentSymbol: state.currentSymbol
      })
    }
  )
);