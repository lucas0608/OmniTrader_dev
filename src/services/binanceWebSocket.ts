import { create as createWebSocket } from 'zustand';

interface WebSocketStore {
  ws: WebSocket | null;
  connect: (symbol: string, onMessage: (data: any) => void) => void;
  disconnect: () => void;
}

export const useBinanceWebSocket = createWebSocket<WebSocketStore>((set, get) => ({
  ws: null,
  
  connect: (symbol: string, onMessage: (data: any) => void) => {
    const ws = get().ws;
    if (ws) {
      ws.close();
    }

    const newWs = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@ticker/${symbol.toLowerCase()}@depth`);
    
    newWs.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };

    newWs.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    set({ ws: newWs });
  },

  disconnect: () => {
    const ws = get().ws;
    if (ws) {
      ws.close();
      set({ ws: null });
    }
  },
}));