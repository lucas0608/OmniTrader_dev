import { create } from 'zustand';
import { User } from '../types/user';
import { AccountStatus, ManagedAccount } from '../types/account';
import { PersistenceService } from '../services/persistenceService';

interface AccountManagerState {
  managedAccounts: ManagedAccount[];
  selectedAccounts: string[];
  isUnlocked: boolean;
  addAccount: (username: string, allUsers: User[]) => void;
  removeAccount: (username: string) => void;
  toggleAccountSelection: (username: string) => void;
  setUnlocked: (unlocked: boolean) => void;
  updateStatus: (username: string, status: AccountStatus) => void;
  loadAccounts: () => void;
}

const generateMockStatus = (username: string): AccountStatus => {
  const statuses: AccountStatus[] = [
    { text: 'READY', color: 'text-white' },
    { text: 'OFFLINE', color: 'text-gray-500' },
    { text: 'L28100 +80', color: 'text-green-500' },
    { text: 'P28208 -20', color: 'text-red-500' }
  ];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

export const useAccountManagerStore = create<AccountManagerState>((set, get) => ({
  managedAccounts: [],
  selectedAccounts: [],
  isUnlocked: false,

  loadAccounts: () => {
    const accounts = PersistenceService.loadManagedAccounts();
    set({ managedAccounts: accounts });
  },

  addAccount: (username, allUsers) => set((state) => {
    const user = allUsers.find(u => u.username === username);
    if (!user || state.managedAccounts.some(a => a.username === username)) {
      return state;
    }
    const newAccounts = [
      ...state.managedAccounts,
      { ...user, status: generateMockStatus(username), isSelected: false }
    ];
    PersistenceService.saveManagedAccounts(newAccounts);
    return { managedAccounts: newAccounts };
  }),

  removeAccount: (username) => set((state) => {
    const newAccounts = state.managedAccounts.filter(a => a.username !== username);
    PersistenceService.saveManagedAccounts(newAccounts);
    return {
      managedAccounts: newAccounts,
      selectedAccounts: state.selectedAccounts.filter(u => u !== username)
    };
  }),

  toggleAccountSelection: (username) => set((state) => ({
    selectedAccounts: state.selectedAccounts.includes(username)
      ? state.selectedAccounts.filter(u => u !== username)
      : [...state.selectedAccounts, username]
  })),

  setUnlocked: (unlocked) => set({ isUnlocked: unlocked }),

  updateStatus: (username, status) => set((state) => {
    const newAccounts = state.managedAccounts.map(account =>
      account.username === username ? { ...account, status } : account
    );
    PersistenceService.saveManagedAccounts(newAccounts);
    return { managedAccounts: newAccounts };
  })
}));