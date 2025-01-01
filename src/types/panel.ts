export interface PanelPosition {
  x: number;
  y: number;
}

export interface DragState {
  key: string;
  startX: number;
  startY: number;
  startIndex: number;
  setId: number;
  initialPosition: PanelPosition;
}

export interface PanelState {
  position: PanelPosition;
  order: number;
  setId?: number;
}

export interface PanelSet {
  id: number;
  panels: string[];
  position: PanelPosition;
}