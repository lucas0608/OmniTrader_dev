import React from 'react';
import { formatPrice } from '../../../../utils/formatters';
import { MarketDataType } from '../../../../types/market';

interface PriceSectionProps {
  data: MarketDataType;
}

export const PriceSection: React.FC<PriceSectionProps> = ({ data }) => (
  <div className="bg-gray-800 p-4 rounded">
    <h3 className="text-theme text-sm mb-3">Price Information</h3>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <div className="text-gray-400 text-xs">Current Price</div>
        <div className="text-white text-lg">${formatPrice(data.price)}</div>
      </div>
      <div>
        <div className="text-gray-400 text-xs">24h Change</div>
        <div className={`text-lg ${data.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {data.priceChange24h >= 0 ? '+' : ''}{data.priceChange24h.toFixed(2)}%
        </div>
      </div>
      <div>
        <div className="text-gray-400 text-xs">24h High</div>
        <div className="text-white">${formatPrice(data.high24h)}</div>
      </div>
      <div>
        <div className="text-gray-400 text-xs">24h Low</div>
        <div className="text-white">${formatPrice(data.low24h)}</div>
      </div>
    </div>
  </div>
);