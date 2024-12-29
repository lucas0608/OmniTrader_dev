import { WebSocketService } from './WebSocketService';
import { BinanceWebSocketService } from './BinanceWebSocketService';
import { CoinCapWebSocketService } from './CoinCapWebSocketService';

export class WebSocketFactory {
  static createService(useBinance: boolean): WebSocketService {
    return useBinance ? new BinanceWebSocketService() : new CoinCapWebSocketService();
  }
}