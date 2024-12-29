import { create } from 'zustand';
import { BinanceSpotService } from '../services/binanceSpotService';
import { useBinanceWebSocket } from '../services/websocket/binanceWebSocket';

interface Position {
  symbol: string;
  amount: number;
  pnl: number;
}

interface OrderBookEntry {
  price: string;
  amount: string;
  total: string;
}

interface OrderBookState {
  asks: OrderBookEntry[];
  bids: OrderBookEntry[];
  lastUpdateId: number;
}

interface TradingState {
  currentPrice: number | null;
  orderBook: OrderBookState | null;
  positions: Position[];
  isLoading: boolean;
  error: string | null;
  fetchPrice: (symbol: string) => Promise<void>;
  fetchOrderBook: (symbol: string) => Promise<void>;
  startDataStream: (symbol: string) => void;
  stopDataStream: () => void;
}

const processOrderBookEntry = ([price, amount]: [string, string]): OrderBookEntry => ({
  price,
  amount,
  total: (parseFloat(price) * parseFloat(amount)).toFixed(8)
});

export const useTradingStore = create<TradingState>((set) => ({
  currentPrice: null,
  orderBook: null,
  positions: [
    { symbol: 'BTCUSDT', amount: 0.5, pnl: 12.5 },
    { symbol: 'ETHUSDT', amount: 5.0, pnl: -3.2 },
    { symbol: 'BNBUSDT', amount: 10.0, pnl: 8.7 }
  ],
  isLoading: false,
  error: null,

  fetchPrice: async (symbol: string) => {
    try {
      set({ isLoading: true, error: null });
      const price = await BinanceSpotService.getPrice(symbol);
      set({ currentPrice: price });
    } catch (error) {
      set({ error: 'Failed to fetch price' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchOrderBook: async (symbol: string) => {
    try {
      set({ isLoading: true, error: null });
      const data = await BinanceSpotService.getOrderBook(symbol);
      
      set({
        orderBook: {
          lastUpdateId: data.lastUpdateId,
          asks: data.asks.map(processOrderBookEntry),
          bids: data.bids.map(processOrderBookEntry)
        }
      });
    } catch (error) {
      set({ error: 'Failed to fetch order book' });
    } finally {
      set({ isLoading: false });
    }
  },

  startDataStream: (symbol: string) => {
    const ws = useBinanceWebSocket.getState();
    ws.connect(
      symbol,
      (price) => set({ currentPrice: price }),
      (asks, bids) => set({
        orderBook: {
          lastUpdateId: Date.now(),
          asks: asks.map(processOrderBookEntry),
          bids: bids.map(processOrderBookEntry)
        }
      })
    );
  },

  stopDataStream: () => {
    const ws = useBinanceWebSocket.getState();
    ws.disconnect();
  }
}));