import React from 'react';
import { formatMarketCap } from '../../../../utils/formatters';
import { MarketDataType } from '../../../../types/market';

interface MarketCapSectionProps {
  data: MarketDataType;
}

export const MarketCapSection: React.FC<MarketCapSectionProps> = ({ data }) => (
  <div className="bg-gray-800 p-4 rounded">
    <h3 className="text-theme text-sm mb-3">Market Cap Information</h3>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <div className="text-gray-400 text-xs">Market Cap</div>
        <div className="text-white">${formatMarketCap(data.marketCap)}</div>
      </div>
      <div>
        <div className="text-gray-400 text-xs">Market Cap Rank</div>
        <div className="text-white">
          {data.marketCapRank ? `#${data.marketCapRank}` : 'N/A'}
        </div>
      </div>
      <div>
        <div className="text-gray-400 text-xs">Circulating Supply</div>
        <div className="text-white">
          {data.circulatingSupply ? 
            `${formatMarketCap(data.circulatingSupply)} ${data.symbol.replace('USDT', '')}` : 
            'N/A'
          }
        </div>
      </div>
      <div>
        <div className="text-gray-400 text-xs">Max Supply</div>
        <div className="text-white">
          {data.maxSupply ? 
            `${formatMarketCap(data.maxSupply)} ${data.symbol.replace('USDT', '')}` : 
            'No Limit'
          }
        </div>
      </div>
    </div>
  </div>
);