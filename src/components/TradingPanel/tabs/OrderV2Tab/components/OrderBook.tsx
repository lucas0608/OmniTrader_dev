import React, { useEffect } from 'react';
import { useTradingStore } from '../../../../../store/tradingStore';
import { useMarketStore } from '../../../../../store/marketStore';
import { LoadingSpinner } from '../../../../common/LoadingSpinner';
import { formatOrderBookPrice, formatOrderBookAmount, formatOrderBookTotal } from '../../../../../utils/formatters';
import '../../../../../styles/scrollbar.css';

interface OrderBookProps {
  onPriceClick: (price: string) => void;
}

export const OrderBook: React.FC<OrderBookProps> = ({ onPriceClick }) => {
  const { currentSymbol } = useMarketStore();
  const { orderBook, isLoading, error, fetchOrderBook } = useTradingStore();

  useEffect(() => {
    fetchOrderBook(currentSymbol);
    const interval = setInterval(() => fetchOrderBook(currentSymbol), 1000);
    return () => clearInterval(interval);
  }, [currentSymbol]);

  if (isLoading && !orderBook) {
    return (
      <div className="bg-gray-800 p-4 rounded h-full flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 p-4 rounded h-full flex items-center justify-center">
        <div className="text-red-500 text-sm">{error}</div>
      </div>
    );
  }

  if (!orderBook) return null;

  return (
    <div className="bg-gray-800 p-4 rounded h-full">
      <h3 className="text-theme text-sm mb-2">Order Book</h3>
      <div className="space-y-1 text-xs">
        <div className="grid grid-cols-3 text-gray-400 mb-1">
          <span>Price</span>
          <span className="text-center">Amount</span>
          <span className="text-right">Total</span>
        </div>
        
        {orderBook.asks.slice().reverse().map((ask, i) => (
          <div 
            key={`ask-${i}`} 
            className="grid grid-cols-3 text-red-500 cursor-pointer hover:bg-gray-700"
            onClick={() => onPriceClick(ask.price)}
          >
            <span>{formatOrderBookPrice(ask.price)}</span>
            <span className="text-center">{formatOrderBookAmount(ask.amount)}</span>
            <span className="text-right">{formatOrderBookTotal(ask.total)}</span>
          </div>
        ))}
        
        <div className="text-theme text-center my-2">
          {formatOrderBookPrice(orderBook.asks[0]?.price || '0')} ≈ ${formatOrderBookPrice(orderBook.asks[0]?.price || '0')}
        </div>
        
        {orderBook.bids.map((bid, i) => (
          <div 
            key={`bid-${i}`} 
            className="grid grid-cols-3 text-green-500 cursor-pointer hover:bg-gray-700"
            onClick={() => onPriceClick(bid.price)}
          >
            <span>{formatOrderBookPrice(bid.price)}</span>
            <span className="text-center">{formatOrderBookAmount(bid.amount)}</span>
            <span className="text-right">{formatOrderBookTotal(bid.total)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};