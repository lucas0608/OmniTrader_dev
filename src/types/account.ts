export interface AccountStatus {
  text: string;
  color?: string;
}

export interface ManagedAccount extends User {
  status: AccountStatus;
  isSelected: boolean;
}