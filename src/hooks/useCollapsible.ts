import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CollapsedState {
  collapsedPanels: Record<string, boolean>;
  togglePanel: (panelName: string) => void;
}

const useCollapsedStore = create<CollapsedState>()(
  persist(
    (set) => ({
      collapsedPanels: {},
      togglePanel: (panelName) => set((state) => ({
        collapsedPanels: {
          ...state.collapsedPanels,
          [panelName]: !state.collapsedPanels[panelName]
        }
      }))
    }),
    {
      name: 'panel-collapsed-state'
    }
  )
);

export const useCollapsible = (panelName: string) => {
  const { collapsedPanels, togglePanel } = useCollapsedStore();
  const isCollapsed = collapsedPanels[panelName] || false;

  return { isCollapsed, toggle: () => togglePanel(panelName) };
};