import { create } from 'zustand';
import { AlgoClass, AlgoStatus, ManagedAlgo } from '../types/algo';
import { predefinedAlgos } from '../data/algos';
import { PersistenceService } from '../services/persistenceService';

interface AlgoManagerState {
  managedAlgos: ManagedAlgo[];
  selectedAlgos: string[];
  isUnlocked: boolean;
  addAlgo: (name: string) => void;
  removeAlgo: (name: string) => void;
  toggleAlgoSelection: (name: string) => void;
  setUnlocked: (unlocked: boolean) => void;
  updateStatus: (name: string, status: AlgoStatus) => void;
  loadAlgos: () => void;
}

const generateMockStatus = (): AlgoStatus => {
  const statuses: AlgoStatus[] = [
    { text: 'READY', color: 'text-white' },
    { text: 'OFFLINE', color: 'text-gray-500' },
    { text: 'P/L +128', color: 'text-green-500' },
    { text: 'P/L -64', color: 'text-red-500' }
  ];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

export const useAlgoManagerStore = create<AlgoManagerState>((set) => ({
  managedAlgos: [],
  selectedAlgos: [],
  isUnlocked: false,

  loadAlgos: () => {
    const algos = PersistenceService.loadManagedAlgos();
    set({ managedAlgos: algos });
  },

  addAlgo: (name) => set((state) => {
    const algo = predefinedAlgos.find(a => a.name === name);
    if (!algo || state.managedAlgos.some(a => a.name === name)) {
      return state;
    }
    const newAlgos = [
      ...state.managedAlgos,
      { ...algo, status: generateMockStatus(), isSelected: false }
    ];
    PersistenceService.saveManagedAlgos(newAlgos);
    return { managedAlgos: newAlgos };
  }),

  removeAlgo: (name) => set((state) => {
    const newAlgos = state.managedAlgos.filter(a => a.name !== name);
    PersistenceService.saveManagedAlgos(newAlgos);
    return {
      managedAlgos: newAlgos,
      selectedAlgos: state.selectedAlgos.filter(n => n !== name)
    };
  }),

  toggleAlgoSelection: (name) => set((state) => ({
    selectedAlgos: state.selectedAlgos.includes(name)
      ? state.selectedAlgos.filter(n => n !== name)
      : [...state.selectedAlgos, name]
  })),

  setUnlocked: (unlocked) => set({ isUnlocked: unlocked }),

  updateStatus: (name, status) => set((state) => {
    const newAlgos = state.managedAlgos.map(algo =>
      algo.name === name ? { ...algo, status } : algo
    );
    PersistenceService.saveManagedAlgos(newAlgos);
    return { managedAlgos: newAlgos };
  })
}));