import { ManagedAccount } from '../types/account';
import { ManagedAlgo } from '../types/algo';

const MANAGED_ACCOUNTS_KEY = 'omni_trader_managed_accounts';
const MANAGED_ALGOS_KEY = 'omni_trader_managed_algos';

export const PersistenceService = {
  loadManagedAccounts: (): ManagedAccount[] => {
    try {
      const data = localStorage.getItem(MANAGED_ACCOUNTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading managed accounts:', error);
      return [];
    }
  },

  saveManagedAccounts: (accounts: ManagedAccount[]): void => {
    try {
      localStorage.setItem(MANAGED_ACCOUNTS_KEY, JSON.stringify(accounts));
    } catch (error) {
      console.error('Error saving managed accounts:', error);
    }
  },

  loadManagedAlgos: (): ManagedAlgo[] => {
    try {
      const data = localStorage.getItem(MANAGED_ALGOS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading managed algos:', error);
      return [];
    }
  },

  saveManagedAlgos: (algos: ManagedAlgo[]): void => {
    try {
      localStorage.setItem(MANAGED_ALGOS_KEY, JSON.stringify(algos));
    } catch (error) {
      console.error('Error saving managed algos:', error);
    }
  }
};