import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FilterItem } from '../types/filter';
import { usePanelVisibility } from '../hooks/usePanelVisibility';

interface FilterState {
  items: FilterItem[];
  pendingOrder: string[] | null;
  reorderItems: (fromIndex: number, toIndex: number) => void;
  resetOrder: () => void;
  applyPendingOrder: () => void;
  clearPendingOrder: () => void;
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
          // Don't allow reordering if either index is for a blocked item
          const fromItem = state.items[fromIndex];
          const toItem = state.items[toIndex];
          if (fromItem?.blocked || toItem?.blocked) return state;

          // Don't allow reordering of locked items
          if (fromItem?.locked || toItem?.locked) return state;

          const newItems = [...state.items];
          const [movedItem] = newItems.splice(fromIndex, 1);
          newItems.splice(toIndex, 0, movedItem);
          
          const updatedItems = newItems.map((item, index) => ({
            ...item,
            order: index
          }));

          // Store the new order as pending
          const pendingOrder = updatedItems
            .filter(item => !item.blocked && item.name !== 'FUNCTION FILTER')
            .map(item => item.name);
          
          return { 
            items: updatedItems,
            pendingOrder
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

      resetOrder: () => {
        set({ items: defaultItems, pendingOrder: null });
        const { updatePanelOrder } = usePanelVisibility.getState();
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
