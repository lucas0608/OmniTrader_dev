export interface WebSocketMessage {
  e: string;  // event type
  s: string;  // symbol
  c?: string; // close price
  lastUpdateId?: number;
  asks?: [string, string][];
  bids?: [string, string][];
}

export interface WebSocketConnection {
  ws: WebSocket | null;
  symbol: string | null;
  isConnected: boolean;
}