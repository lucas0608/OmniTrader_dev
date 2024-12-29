import { create } from 'zustand';
import { BalanceStore } from '../types/balance';
import { BinanceBalanceService } from '../services/binanceBalanceService';

// Create store without using Symbol or non-cloneable values
export const useBalanceStore = create<BalanceStore>()((set) => ({
  balance: null,
  isLoading: false,
  error: null,

  fetchBalance: async () => {
    try {
      set({ isLoading: true, error: null });
      const balance = await BinanceBalanceService.getAccountBalance();
      set({ balance, isLoading: false });
    } catch (error) {
      set({ 
        error: 'Failed to fetch balance',
        isLoading: false 
      });
    }
  }
}));