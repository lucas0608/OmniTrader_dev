export interface Position {
  asset: string;
  free: number;
  locked: number;
  total: number;
}

export interface AccountBalance {
  totalBalance: number;
  availableBalance: number;
  positions: Position[];
}

export interface BalanceStore {
  balance: AccountBalance | null;
  isLoading: boolean;
  error: string | null;
  fetchBalance: () => Promise<void>;
}