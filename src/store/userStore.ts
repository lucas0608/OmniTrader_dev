import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserSettings } from '../types/user';
import { UserService } from '../services/userService';

interface UserStore {
  users: User[];
  currentUser: User | null;
  algoEnabled: boolean;
  settings: UserSettings;
  addUser: (user: User) => void;
  updateUser: (username: string, updatedUser: User) => void;
  deleteUser: (username: string) => void;
  selectUser: (username: string) => void;
  toggleAlgo: () => void;
  updateUserSettings: (settings: Partial<UserSettings>) => void;
  updateMaskSettings: (key: keyof UserSettings['maskSettings'], value: boolean) => void;
  loadUsers: () => void;
}

const initialSettings: UserSettings = {
  theme: 'dark',
  themeColor: '#ff9933',
  language: 'en',
  notifications: true,
  autoLogout: 30,
  twoFactorAuth: false,
  tradingMode: 'manual',
  riskLevel: 'medium',
  defaultLeverage: 10,
  dataMethod: 'polling',
  priceSource: {
    binance: true,
    coincap: false
  },
  maskSettings: {
    volumeMask: false,
    totalBalanceMask: false,
    availableBalanceMask: false
  },
  presetColors: ['#FF9933', '#52E2FF', '#F5FFFF', '#4AD34D'],
  modalPositions: {}
};

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      users: [],
      currentUser: null,
      algoEnabled: false,
      settings: initialSettings,

      loadUsers: () => {
        const users = UserService.loadUsers();
        set({ users });
        if (users.length > 0 && !get().currentUser) {
          set({ currentUser: users[0] });
        }
      },

      addUser: (user) => {
        set((state) => {
          const newUsers = [...state.users, user];
          UserService.saveUsers(newUsers);
          return {
            users: newUsers,
            currentUser: user
          };
        });
      },

      updateUser: (username, updatedUser) => {
        set((state) => {
          const newUsers = state.users.map(user => 
            user.username === username ? updatedUser : user
          );
          UserService.saveUsers(newUsers);
          return {
            users: newUsers,
            currentUser: state.currentUser?.username === username ? updatedUser : state.currentUser
          };
        });
      },

      deleteUser: (username) => {
        set((state) => {
          const newUsers = state.users.filter(u => u.username !== username);
          UserService.saveUsers(newUsers);
          return {
            users: newUsers,
            currentUser: state.currentUser?.username === username ? null : state.currentUser
          };
        });
      },

      selectUser: (username) => set((state) => ({
        currentUser: state.users.find(u => u.username === username) || null
      })),

      toggleAlgo: () => set((state) => ({
        algoEnabled: !state.algoEnabled
      })),

      updateUserSettings: (newSettings) => {
        set((state) => {
          const updatedSettings = { ...state.settings, ...newSettings };
          // Update CSS variable when theme color changes
          if (newSettings.themeColor) {
            document.documentElement.style.setProperty('--primary-color', newSettings.themeColor);
          }
          return { settings: updatedSettings };
        });
      },

      updateMaskSettings: (key, value) => set((state) => ({
        settings: {
          ...state.settings,
          maskSettings: {
            ...state.settings.maskSettings,
            [key]: value
          }
        }
      }))
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        currentUser: state.currentUser,
        settings: state.settings,
        algoEnabled: state.algoEnabled
      })
    }
  )
);