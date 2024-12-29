import { WebSocketMessage } from './types';

export const createMessageHandler = (
  onPrice: (price: number) => void,
  onOrderBook: (asks: [string, string][], bids: [string, string][]) => void
) => {
  return (event: MessageEvent) => {
    const data: WebSocketMessage = JSON.parse(event.data);
    
    switch (data.e) {
      case '24hrTicker':
        if (data.c) {
          onPrice(parseFloat(data.c));
        }
        break;
      case 'depthUpdate':
        if (data.asks && data.bids) {
          onOrderBook(data.asks, data.bids);
        }
        break;
    }
  };
};