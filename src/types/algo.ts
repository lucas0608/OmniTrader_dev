export type AlgoClass = 'LIVE' | 'DEMO';

export interface AlgoStatus {
  text: string;
  color?: string;
}

export interface ManagedAlgo {
  name: string;
  class: AlgoClass;
  status: AlgoStatus;
  isSelected: boolean;
}