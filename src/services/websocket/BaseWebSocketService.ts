export abstract class BaseWebSocketService extends EventEmitter implements WebSocketService {
  protected ws: WebSocket | null = null;
  protected symbol: string = '';
  protected reconnectAttempts = 0;
  protected maxReconnectAttempts = 3;
  protected reconnectDelay = 3000;
  protected reconnectTimer: NodeJS.Timeout | null = null;

  connect(symbol: string): void {
    this.cleanup();
    this.symbol = symbol;
  }

  disconnect(): void {
    this.cleanup();
  }

  private cleanup(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.reconnectAttempts = 0;
  }

  protected handleError(error: any): void {
    console.error('WebSocket error:', error);
    this.emit('error', error);
    
    // Only attempt reconnect if not already trying
    if (!this.reconnectTimer) {
      this.attemptReconnect();
    }
  }

  protected attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      this.reconnectTimer = setTimeout(() => {
        console.log(`Reconnecting (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
        this.connect(this.symbol);
        this.reconnectTimer = null;
      }, this.reconnectDelay * this.reconnectAttempts); // Exponential backoff
    } else {
      this.emit('maxRetriesExceeded');
      this.cleanup();
    }
  }

  protected setupWebSocket(ws: WebSocket): void {
    ws.onopen = () => {
      this.reconnectAttempts = 0;
      this.emit('open');
    };

    ws.onclose = (event) => {
      this.emit('close', event);
      if (!event.wasClean) {
        this.attemptReconnect();
      }
    };

    ws.onerror = this.handleError.bind(this);
  }
}