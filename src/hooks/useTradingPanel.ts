import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TabType } from '../types/trading';

interface TradingPanelState {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const useTradingPanel = create<TradingPanelState>()(
  persist(
    (set) => ({
      activeTab: 'ORDER',
      setActiveTab: (tab) => set({ activeTab: tab })
    }),
    {
      name: 'trading-panel-storage'
    }
  )
);