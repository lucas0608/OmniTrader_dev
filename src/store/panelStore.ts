import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PanelPosition, PanelState } from '../types/panel';
import { usePanelVisibility } from '../hooks/usePanelVisibility';

interface PanelStore {
  panelStates: Record<string, PanelState>;
  panelSets: PanelSet[];
  isMobileView: boolean;
  activePanel: string | null;
  addNewSet: () => void;
  closeAllSets: () => void;
  resetPositions: () => void;
  initializePositions: () => void;
  setPanelPosition: (panelName: string, position: PanelPosition) => void;
  setMobileView: (isMobile: boolean) => void;
  setActivePanel: (panelName: string | null) => void;
}

const PANEL_NAMES = [
  'ADMIN PANEL',
  'FUNCTION FILTER',
  'TRADING PANEL',
  'ACCOUNT MANAGER',
  'ALGO MANAGER',
  'COMPACT TRADING PANEL'
];

// Panel layout constants
const PANEL_WIDTH = 448;
const PANEL_GAP = 5; // Gap between panels in same set
const SET_GAP = 8; // Gap between different sets
const LEFT_MARGIN = 5;
const TOP_MARGIN = 5;

// Define specific panel heights and positions
const PANEL_CONFIGS = {
  'ADMIN PANEL': { height: 350, x: LEFT_MARGIN, y: TOP_MARGIN },
  'FUNCTION FILTER': { height: 350, x: LEFT_MARGIN + PANEL_WIDTH + SET_GAP, y: TOP_MARGIN },
  'TRADING PANEL': { height: 400, x: LEFT_MARGIN, y: TOP_MARGIN + 370 },
  'ACCOUNT MANAGER': { height: 100, x: LEFT_MARGIN, y: TOP_MARGIN + 965 },
  'ALGO MANAGER': { height: 100, x: LEFT_MARGIN, y: TOP_MARGIN + 1195 },
 // 'COMPACT TRADING PANEL': { height: 150, x: LEFT_MARGIN, y: TOP_MARGIN + 966 }
  'COMPACT TRADING PANEL': { height: 150, x: LEFT_MARGIN + PANEL_WIDTH + SET_GAP, y: TOP_MARGIN + 370 },
};

const calculateInitialPositions = (isMobile: boolean = false) => {
  const positions = PANEL_NAMES.reduce((acc, name, index) => {
    // For mobile view, only use vertical stacking
    if (isMobile) {
      const previousPanels = PANEL_NAMES.slice(0, index);
      const totalHeight = previousPanels.reduce((sum, panelName) => 
        sum + PANEL_CONFIGS[panelName].height + PANEL_GAP, 0
      );
      return {
        ...acc,
        [name]: {
          position: { x: 0, y: totalHeight },
          order: index,
          zIndex: 1
        }
      };
    }

    return {
      ...acc,
      [name]: {
        position: {
          x: PANEL_CONFIGS[name].x,
          y: PANEL_CONFIGS[name].y
        },
        order: index,
        zIndex: 1
      }
    };
  }, {} as Record<string, PanelState>);

  return positions;
};

export const usePanelStore = create<PanelStore>()(
  persist(
    (set) => ({
      panelStates: {},
      panelSets: [],
      isMobileView: window.innerWidth < 768,
      activePanel: null,


      addNewSet: () => set((state) => {
        if (state.isMobileView || state.panelSets.length >= 4) return state;

        // Calculate new set ID and position
        const existingSets = state.panelSets.length;
        const newSetId = existingSets + 1;
        const { panelOrder } = usePanelVisibility.getState();
        const setXOffset = LEFT_MARGIN + ((PANEL_WIDTH + SET_GAP) * existingSets);

        const newPanelNames = PANEL_NAMES.map(name => `${name}_SET${newSetId}`);
        const newPanelStates = { ...state.panelStates };
        const newOrder = [...panelOrder];
        
        PANEL_NAMES.forEach((name) => {
          const baseConfig = PANEL_CONFIGS[name];
          const newPanelName = `${name}_SET${newSetId}`;
          // Calculate x position based on panel type and set
          const xOffset = name === 'FUNCTION FILTER' 
            ? setXOffset + PANEL_WIDTH + PANEL_GAP 
            : setXOffset;

          newPanelStates[newPanelName] = {
            position: {
              x: xOffset,
              y: baseConfig.y
            },
            order: PANEL_NAMES.indexOf(name),
            setId: newSetId,
            zIndex: 1
          };
          
          // Only add to panel order if not Function Filter
          if (!name.includes('FUNCTION FILTER')) {
            newOrder.push(newPanelName);
          }
        });

        const { updatePanelOrder } = usePanelVisibility.getState();
        updatePanelOrder(newOrder);

        const newSet: PanelSet = {
          id: newSetId,
          panels: newPanelNames,
          position: { x: setXOffset, y: 0 }
        };

        return {
          panelStates: newPanelStates,
          panelSets: [...state.panelSets, newSet]
        };
      }),

      closeAllSets: () => set((state) => {
        if (state.isMobileView) return state;

        // Get original panel order
        const originalPanels = PANEL_NAMES.filter(name => 
          !name.includes('SUPER OVERRIDE') && name !== 'FUNCTION FILTER'
        );

        // Update panel visibility
        const { updatePanelOrder } = usePanelVisibility.getState();
        updatePanelOrder(originalPanels);

        return {
          panelStates: Object.entries(state.panelStates)
            .filter(([name]) => !name.includes('_SET'))
            .reduce((acc, [name, state]) => ({ ...acc, [name]: state }), {}),
          panelSets: []
        };
      }),
      initializePositions: () => set((state) => ({
        panelStates: state.panelStates && Object.keys(state.panelStates).length > 0
          ? state.panelStates
          : calculateInitialPositions(state.isMobileView)
      })),

      setPanelPosition: (panelName, position) => set((state) => {
        // Extract set ID from panel name
        const setMatch = panelName.match(/_SET(\d+)$/);
        const setId = setMatch ? parseInt(setMatch[1]) : 0;

        // Update panel state with set-specific position
        return {
          panelStates: {
            ...state.panelStates,
            [panelName]: {
              ...state.panelStates[panelName],
              position,
              zIndex: 2,
              setId
            }
          },
          activePanel: panelName
        };
      }),

      setActivePanel: (panelName) => set((state) => ({
        panelStates: Object.fromEntries(
          Object.entries(state.panelStates).map(([name, panel]) => [
            name,
            {
              ...panel,
              zIndex: name === panelName ? 2 : 1
            }
          ])
        ),
        activePanel: panelName
      })),

      resetPositions: () => set((state) => {
        // Reset panel positions based on view mode
        const positions = calculateInitialPositions(state.isMobileView);
        
        // Reset panel order to default
        const defaultOrder = PANEL_NAMES
          .filter(name => !name.includes('SUPER OVERRIDE') && name !== 'FUNCTION FILTER')
          .map(name => name);
        
        // Update panel order in visibility store
        const { updatePanelOrder } = usePanelVisibility.getState();
        updatePanelOrder(defaultOrder);
        
        return {
          panelStates: positions,
          activePanel: null
        };
      }),

      setMobileView: (isMobile) => set({
        isMobileView: isMobile,
        panelStates: calculateInitialPositions(isMobile)
      })
    }),
    {
      name: 'panel-store',
      version: 7,
      migrate: (persistedState: any, version: number) => {
        if (version < 7) {
          return {
            panelStates: {},
            isMobileView: window.innerWidth < 768,
            activePanel: null,
            panelSets: []
          };
        }
        return persistedState;
      },
      migrate: (persistedState: any, version: number) => {
        if (version < 7) {
          // Reset to initial state if version is old
          return {
            panelStates: {},
            isMobileView: window.innerWidth < 768,
            activePanel: null,
            panelSets: []
          };
        }
        return persistedState;
      },
      partialize: (state) => ({
        panelStates: state.panelStates,
        isMobileView: state.isMobileView
      })
    }
  )
);