import { WebSocketFactory } from './WebSocketFactory';
import { WebSocketService } from './WebSocketService';
import { useUserStore } from '../../store/userStore';

class WebSocketManager {
  private static instance: WebSocketManager;
  private service: WebSocketService | null = null;
  private currentSymbol: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;
  private reconnectDelay = 3000;
  private reconnectTimer: NodeJS.Timeout | null = null;

  private constructor() {}

  static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager();
    }
    return WebSocketManager.instance;
  }

  initialize(symbol: string): void {
    const { settings } = useUserStore.getState();
    
    // Only initialize if streaming is enabled
    if (settings.dataMethod !== 'streaming') {
      return;
    }

    this.currentSymbol = symbol.toLowerCase();
    
    if (this.service) {
      this.service.disconnect();
    }

    this.service = WebSocketFactory.createService(settings.priceSource.binance);
    this.reconnectAttempts = 0;
    this.connect();
  }

  private connect(): void {
    if (this.service && this.currentSymbol) {
      try {
        this.service.connect(this.currentSymbol);
      } catch (error) {
        console.error('WebSocket connection error:', error);
        this.handleReconnect();
      }
    }
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
      }

      this.reconnectTimer = setTimeout(() => {
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts); // Exponential backoff
    } else {
      console.log('Max reconnection attempts reached');
      this.disconnect();
    }
  }

  disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.service) {
      this.service.disconnect();
      this.service = null;
    }

    this.reconnectAttempts = 0;
  }

  getService(): WebSocketService | null {
    return this.service;
  }

  updateDataSource(useBinance: boolean): void {
    const symbol = this.currentSymbol;
    this.disconnect();
    this.service = WebSocketFactory.createService(useBinance);
    if (symbol) {
      this.currentSymbol = symbol;
      this.connect();
    }
  }
}

export const wsManager = WebSocketManager.getInstance();