import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MarketData } from '../types/market';
import { BinanceApiService } from '../services/binanceApi';
import { CoinCapService } from '../services/cryptoService';
import { useUserStore } from './userStore';

interface MarketState {
  currentSymbol: string;
  symbolsBySet: Record<number, string>;
  marketData: MarketData | null;
  marketDataBySet: Record<number, MarketData | null>;
  isLoading: boolean;
  error: string | null;
  setCurrentSymbol: (symbol: string, setId?: number) => void;
  fetchMarketData: (symbol: string, setId?: number) => Promise<void>;
}

export const useMarketStore = create<MarketState>()(
  persist(
    (set) => ({
      currentSymbol: 'BTCUSDT',
      symbolsBySet: {},
      marketData: null,
      marketDataBySet: {},
      isLoading: false,
      error: null,

      setCurrentSymbol: (symbol: string, setId?: number) => set((state) => ({
        currentSymbol: setId === undefined ? symbol : state.currentSymbol,
        symbolsBySet: setId !== undefined ? {
          ...state.symbolsBySet,
          [setId]: symbol
        } : state.symbolsBySet
      })),

      fetchMarketData: async (symbol: string, setId?: number) => {
        set({ isLoading: true });
        try {
          const { settings } = useUserStore.getState();
          const data = settings.priceSource.binance 
            ? await BinanceApiService.getMarketData(symbol)
            : await CoinCapService.getMarketData(symbol);

          set((state) => ({
            marketData: setId === undefined ? data : state.marketData, // Main data
            marketDataBySet: setId !== undefined 
              ? { ...state.marketDataBySet, [setId]: { ...data } } // Clone data for set
              : state.marketDataBySet,
            error: null,
            isLoading: false
          }));
        } catch (error) {
          set({ 
            error: 'Failed to fetch market data',
            isLoading: false 
          });
        }
      }
    }),
    {
      name: 'market-store',
      version: 2,
      partialize: (state) => ({
        currentSymbol: state.currentSymbol,
        symbolsBySet: state.symbolsBySet,
        marketDataBySet: state.marketDataBySet
      })
    }
  )
);