import React, { useState, useEffect } from 'react';
import { useTradingStore } from '../../../../../store/tradingStore';
import { useMarketStore } from '../../../../../store/marketStore';

interface OrderInputsProps {
  orderType: 'market' | 'limit';
  position: 'long' | 'short';
  selectedPrice?: string;
}

export const OrderInputs: React.FC<OrderInputsProps> = ({ orderType, position, selectedPrice }) => {
  const { currentSymbol } = useMarketStore();
  const { currentPrice, error } = useTradingStore();
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [leverage, setLeverage] = useState('1');

  // Extract base currency from symbol (e.g., 'BTC' from 'BTCUSDT')
  const baseAsset = currentSymbol.replace('USDT', '');

  useEffect(() => {
    if (selectedPrice) {
      setPrice(selectedPrice);
    }
  }, [selectedPrice]);

  return (
    <div className="space-y-3">
      {orderType === 'limit' ? (
        <div>
          <label className="text-white text-xs block mb-1">Price (USDT)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder={currentPrice?.toString()}
            className="w-full bg-gray-700 text-white p-2 text-sm rounded"
          />
        </div>
      ) : (
        <div>
          <label className="text-white text-xs block mb-1">Size (USDT)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-gray-700 text-white p-2 text-sm rounded"
          />
        </div>
      )}
      
      <div>
        <label className="text-white text-xs block mb-1">Leverage</label>
        <select
          value={leverage}
          onChange={(e) => setLeverage(e.target.value)}
          className="w-full bg-gray-700 text-white p-2 text-sm rounded"
        >
          {[1, 2, 3, 5, 10, 20, 50, 100].map(x => (
            <option key={x} value={x}>{x}x</option>
          ))}
        </select>
      </div>

      {error && <div className="text-red-500 text-xs">{error}</div>}

      <button 
        className={`w-full py-3 text-black font-bold rounded ${
          position === 'long' 
            ? 'bg-green-500 hover:bg-green-600' 
            : 'bg-red-500 hover:bg-red-600'
        }`}
      >
        {position === 'long' ? 'Buy/Long' : 'Sell/Short'} {baseAsset}
      </button>
    </div>
  );
};