import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PanelVisibilityState {
  visiblePanels: { [key: string]: boolean };
  panelOrder: string[];
  togglePanel: (panel: string) => void;
  updatePanelOrder: (newOrder: string[]) => void;
}

export const usePanelVisibility = create<PanelVisibilityState>()(
  persist(
    (set) => ({
      visiblePanels: {
        'ADMIN PANEL': true,
        'TRADING PANEL': true,
        'ACCOUNT MANAGER': true,
        'ALGO MANAGER': true,
        'COMPACT TRADING PANEL': false, // Set to false by default
      },
      panelOrder: [
        'ADMIN PANEL',
        'TRADING PANEL',
        'ACCOUNT MANAGER',
        'ALGO MANAGER',
        'COMPACT TRADING PANEL'
      ],
      togglePanel: (panel) =>
        set((state) => ({
          visiblePanels: {
            ...state.visiblePanels,
            [panel]: !state.visiblePanels[panel],
          },
        })),
      updatePanelOrder: (newOrder) =>
        set({ panelOrder: Array.from(new Set(newOrder)) }),
    }),
    {
      name: 'panel-visibility-storage',
      version: 2, // Increment version to force reset of stored state
    }
  )
);