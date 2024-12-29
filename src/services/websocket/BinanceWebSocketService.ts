import { BaseWebSocketService } from './WebSocketService';

export class BinanceWebSocketService extends BaseWebSocketService {
  connect(symbol: string): void {
    super.connect(symbol);
    
    try {
      const wsUrl = `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@ticker/${symbol.toLowerCase()}@depth`;
      this.ws = new WebSocket(wsUrl);

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.e === '24hrTicker') {
            this.emit('message', {
              type: 'price',
              data: parseFloat(data.c) // Current price
            });
          } else if (data.e === 'depthUpdate') {
            this.emit('message', {
              type: 'orderbook',
              data: {
                asks: data.asks,
                bids: data.bids
              }
            });
          }
        } catch (error) {
          console.error('WebSocket message parsing error:', error);
        }
      };

      this.setupWebSocket(this.ws);
    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.handleError(error);
    }
  }
}