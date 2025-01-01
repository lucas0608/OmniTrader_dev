import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useFilterStore } from '../store/filterStore';

interface PanelVisibilityState {
  visiblePanels: { [key: string]: boolean };
  panelOrder: string[];
  updateVisiblePanels: (panels: { [key: string]: boolean }) => void;
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
        set((state) => {
          const { visiblePanels } = state;
          const { syncWithPanelOrder } = useFilterStore.getState();
          
          // Create visibility state for new panels
          const newVisiblePanels = { ...visiblePanels };
          newOrder.forEach(panel => {
            if (!(panel in newVisiblePanels)) {
              // Only show Admin Panel for new sets
              newVisiblePanels[panel] = panel.includes('ADMIN PANEL') && panel.includes('_SET');
            }
          });
          
          // Sync with Function Filter in mobile view
          if (window.innerWidth < 768) {
            syncWithPanelOrder(newOrder);
          }
          
          return {
            panelOrder: Array.from(new Set(newOrder)),
            visiblePanels: newVisiblePanels
          };
        }),
    }),
    {
      name: 'panel-visibility-storage',
      version: 2, // Increment version to force reset of stored state
    }
  )
);