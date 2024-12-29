import { BaseWebSocketService, WebSocketMessage } from './WebSocketService';

export class CoinCapWebSocketService extends BaseWebSocketService {
  connect(symbol: string): void {
    super.connect(symbol);
    
    // CoinCap uses a different format for symbols
    const baseAsset = symbol.replace('USDT', '').toLowerCase();
    this.ws = new WebSocket('wss://ws.coincap.io/prices?assets=' + baseAsset);

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data[baseAsset]) {
          this.emit('message', {
            type: 'price',
            data: parseFloat(data[baseAsset])
          });
        }
      } catch (error) {
        this.handleError(error);
      }
    };

    this.setupWebSocket(this.ws);
  }
}