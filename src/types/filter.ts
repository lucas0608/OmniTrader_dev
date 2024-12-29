export interface FilterItem {
  name: string;
  locked?: boolean;
  blocked?: boolean;
  order: number;
}

export interface DragInfo {
  index: number;
  startY: number;
  isLockedGroup?: boolean;
}