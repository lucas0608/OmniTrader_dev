export interface WebSocketMessage {
  type: 'price' | 'orderbook';
  data: any;
}

export interface WebSocketStatus {
  connected: boolean;
  error: string | null;
}