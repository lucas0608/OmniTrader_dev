import React, { useState } from 'react';
import { OrderForm } from './components/OrderForm';
import { OrderBook } from './components/OrderBook';
import { MarketInfo } from './components/MarketInfo';
import { OrderControls } from './components/OrderControls';
import { useMarketData } from './hooks/useMarketData';

export const OrderV2Tab = () => {
  const [selectedPrice, setSelectedPrice] = useState<string>('');
  useMarketData();

  const handlePriceClick = (price: string) => {
    setSelectedPrice(price);
  };

  return (
    <div className="space-y-4">
      <MarketInfo />
      <div className="grid grid-cols-2 gap-4">
        <OrderForm selectedPrice={selectedPrice} />
        <OrderBook onPriceClick={handlePriceClick} />
      </div>
      <OrderControls />
    </div>
  );
};