import React, { useState } from 'react';

export const OrderTab = () => {
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [position, setPosition] = useState<'long' | 'short'>('long');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [leverage, setLeverage] = useState('1');

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-4">
        <div className="flex gap-2">
          <button 
            className={`flex-1 py-2 text-sm ${
              orderType === 'market' ? 'bg-[#ff9933] text-black' : 'bg-gray-700 text-white'
            }`}
            onClick={() => setOrderType('market')}
          >
            Market
          </button>
          <button 
            className={`flex-1 py-2 text-sm ${
              orderType === 'limit' ? 'bg-[#ff9933] text-black' : 'bg-gray-700 text-white'
            }`}
            onClick={() => setOrderType('limit')}
          >
            Limit
          </button>
        </div>

        <div className="flex gap-2">
          <button 
            className={`flex-1 py-2 text-sm ${
              position === 'long' ? 'bg-green-500 text-black' : 'bg-gray-700 text-white'
            }`}
            onClick={() => setPosition('long')}
          >
            Long
          </button>
          <button 
            className={`flex-1 py-2 text-sm ${
              position === 'short' ? 'bg-red-500 text-black' : 'bg-gray-700 text-white'
            }`}
            onClick={() => setPosition('short')}
          >
            Short
          </button>
        </div>

        <div className="space-y-2">
          {orderType === 'limit' && (
            <div>
              <label className="text-white text-xs block mb-1">Price (USDT)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-gray-700 text-white p-2 text-sm"
              />
            </div>
          )}

          <div>
            <label className="text-white text-xs block mb-1">Amount (BTC)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-gray-700 text-white p-2 text-sm"
            />
          </div>

          <div>
            <label className="text-white text-xs block mb-1">Leverage</label>
            <select
              value={leverage}
              onChange={(e) => setLeverage(e.target.value)}
              className="w-full bg-gray-700 text-white p-2 text-sm"
            >
              {[1, 2, 3, 5, 10, 20, 50, 100].map(x => (
                <option key={x} value={x}>{x}x</option>
              ))}
            </select>
          </div>
        </div>

        <button 
          className={`w-full py-3 text-black font-bold ${
            position === 'long' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {position === 'long' ? 'Buy/Long' : 'Sell/Short'} BTC
        </button>
      </div>

      <div className="bg-gray-800 p-4">
        <h3 className="text-[#ff9933] text-sm mb-2">Order Book</h3>
        <div className="space-y-1 text-xs">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={`sell-${i}`} className="grid grid-cols-3 text-red-500">
              <span>28,450.50</span>
              <span className="text-center">0.0234</span>
              <span className="text-right">665.74</span>
            </div>
          ))}
          
          <div className="text-[#ff9933] text-center my-2">
            28,432.25 ≈ $28,432.25
          </div>
          
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={`buy-${i}`} className="grid grid-cols-3 text-green-500">
              <span>28,425.75</span>
              <span className="text-center">0.0158</span>
              <span className="text-right">449.13</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};