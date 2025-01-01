import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FilterItem } from '../types/filter';
import { usePanelVisibility } from '../hooks/usePanelVisibility';
import { usePanelStore } from './panelStore';
import { isValidMove, getBlockedIndex } from '../utils/filterUtils';

interface FilterState {
  items: FilterItem[];
  pendingOrder: string[] | null;
  reorderItems: (fromIndex: number, toIndex: number) => void;
  resetOrder: () => void;
  applyPendingOrder: () => void;
  clearPendingOrder: () => void;
  syncWithPanelOrder: (panelOrder: string[]) => void;
}

const defaultItems: FilterItem[] = [
  { name: 'ADMIN PANEL', locked: true, order: 0 },
  { name: 'FUNCTION FILTER', locked: true, order: 1 },
  { name: 'TRADING PANEL', locked: false, order: 2 },
  { name: 'ACCOUNT MANAGER', locked: false, order: 3 },
  { name: 'ALGO MANAGER', locked: false, order: 4 },
  { name: 'COMPACT TRADING PANEL', locked: false, order: 5 },
  { name: 'SUPER OVERRIDE', blocked: true, order: 6 }
];

export const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      items: defaultItems,
      pendingOrder: null,

      reorderItems: (fromIndex: number, toIndex: number) => {
        set((state) => {
          const blockedIndex = getBlockedIndex(state.items);
          
          // Validate the move
          if (!isValidMove(fromIndex, toIndex, state.items, blockedIndex)) {
            return state;
          }

          // Create a new array and move the item
          const newItems = [...state.items];
          const [movedItem] = newItems.splice(fromIndex, 1);
          newItems.splice(toIndex, 0, movedItem);

          // Update order property for all items
          const updatedItems = newItems.map((item, index) => ({
            ...item,
            order: index
          }));

          // Create new panel order excluding blocked items and function filter
          const newOrder = updatedItems
            .filter(item => !item.blocked && item.name !== 'FUNCTION FILTER')
            .map(item => item.name);

          return { 
            items: updatedItems,
            pendingOrder: newOrder
          };
        });
      },

      applyPendingOrder: () => {
        set((state) => {
          if (state.pendingOrder) {
            const { updatePanelOrder } = usePanelVisibility.getState();
            updatePanelOrder(state.pendingOrder);
          }
          return { pendingOrder: null };
        });
      },

      clearPendingOrder: () => {
        set({ pendingOrder: null });
      },
      
      syncWithPanelOrder: (panelOrder) => {
        set((state) => {
          const newItems = [...state.items];
          
          // Update order based on panel order
          panelOrder.forEach((panelName, index) => {
            const itemIndex = newItems.findIndex(item => item.name === panelName);
            if (itemIndex !== -1) {
              newItems[itemIndex].order = index;
            }
          });
          
          return { items: newItems };
        });
      },

      resetOrder: () => {
        set({ items: defaultItems, pendingOrder: null });
        const { updatePanelOrder } = usePanelVisibility.getState();
        const { setMobileView } = usePanelStore.getState();
        
        // Reset panel positions based on view mode
        const isMobile = window.innerWidth < 768;
        setMobileView(isMobile);
        
        const defaultOrder = defaultItems
          .filter(item => !item.blocked && item.name !== 'FUNCTION FILTER')
          .map(item => item.name);
        
        updatePanelOrder(defaultOrder);
      }
    }),
    {
      name: 'filter-storage',
      version: 3,
    }
  )
);