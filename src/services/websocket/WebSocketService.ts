import { EventEmitter } from './EventEmitter';

export interface WebSocketMessage {
  type: 'price' | 'orderbook';
  data: any;
}

export interface WebSocketService {
  connect: (symbol: string) => void;
  disconnect: () => void;
  onMessage: (callback: (message: WebSocketMessage) => void) => void;
  isConnected: () => boolean;
}

export class BaseWebSocketService extends EventEmitter implements WebSocketService {
  protected ws: WebSocket | null = null;
  protected symbol: string = '';
  protected reconnectAttempts = 0;
  protected maxReconnectAttempts = 3;
  protected reconnectDelay = 3000;

  connect(symbol: string): void {
    this.symbol = symbol;
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  onMessage(callback: (message: WebSocketMessage) => void): void {
    this.on('message', callback);
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  protected handleError(error: any): void {
    console.error('WebSocket error:', error);
    this.emit('error', error);
    this.attemptReconnect();
  }

  protected attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
        this.connect(this.symbol);
      }, this.reconnectDelay);
    }
  }

  protected setupWebSocket(ws: WebSocket): void {
    ws.onopen = () => {
      this.reconnectAttempts = 0;
      this.emit('open');
    };

    ws.onclose = () => {
      this.emit('close');
      this.attemptReconnect();
    };

    ws.onerror = this.handleError.bind(this);
  }
}