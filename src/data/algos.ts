import { AlgoClass } from '../types/algo';

export interface AlgoData {
  name: string;
  class: AlgoClass;
}

export const predefinedAlgos: AlgoData[] = [
  { name: 'MSA+BB', class: 'LIVE' },
  { name: 'TestALGO', class: 'DEMO' }
];