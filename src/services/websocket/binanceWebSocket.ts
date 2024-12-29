import { create } from 'zustand';
import { WebSocketConnection } from './types';
import { WS_CONFIG } from './config';

interface WebSocketStore extends WebSocketConnection {
  connect: (
    symbol: string,
    onPrice: (price: number) => void,
    onOrderBook: (asks: [string, string][], bids: [string, string][]) => void
  ) => void;
  disconnect: () => void;
}

export const useBinanceWebSocket = create<WebSocketStore>((set, get) => ({
  ws: null,
  symbol: null,
  isConnected: false,

  connect: (symbol, onPrice, onOrderBook) => {
    const current = get();
    if (current.ws) {
      current.ws.close();
    }

    const wsUrl = `${WS_CONFIG.BASE_URL}/${symbol.toLowerCase()}@ticker/${symbol.toLowerCase()}@depth`;
    const ws = new WebSocket(wsUrl);
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.e === '24hrTicker' && data.c) {
          onPrice(parseFloat(data.c));
        } else if (data.e === 'depthUpdate' && data.asks && data.bids) {
          onOrderBook(data.asks, data.bids);
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    };
    
    ws.onopen = () => set({ isConnected: true });
    ws.onclose = () => set({ isConnected: false });
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      set({ isConnected: false });
    };

    set({ ws, symbol, isConnected: false });
  },

  disconnect: () => {
    const { ws } = get();
    if (ws) {
      ws.close();
      set({ ws: null, symbol: null, isConnected: false });
    }
  }
}));