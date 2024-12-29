import React, { useRef } from 'react';
import { useMarketStore } from '../../../store/marketStore';
import { useDraggableY } from '../../../hooks/useDraggableY';
import { useClickOutside } from '../../../hooks/useClickOutside';
import { formatPrice, formatVolume, formatMarketCap } from '../../../utils/formatters';

interface MarketDataModalProps {
  symbol: string;
  onClose: () => void;
}

export const MarketDataModal: React.FC<MarketDataModalProps> = ({ symbol, onClose }) => {
  const { marketData } = useMarketStore();
  const { position, handleMouseDown } = useDraggableY();
  const modalRef = useRef<HTMLDivElement>(null);

  useClickOutside(modalRef, onClose);

  if (!marketData) return null;

  // Extract base asset from symbol (e.g., "BTCUSDT" -> "BTC")
  const baseAsset = symbol.replace('USDT', '');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div 
        ref={modalRef}
        className="bg-[#1a1a1a] border border-theme p-4 w-full max-w-md rounded-lg"
        style={{ transform: `translateY(${position.y}px)` }}
      >
        <div 
          className="flex justify-between items-center mb-4 cursor-move"
          onMouseDown={handleMouseDown}
        >
          <h2 className="text-theme text-sm">{baseAsset} Market Data</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">×</button>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-800 p-4 rounded">
            <h3 className="text-theme text-sm mb-2">Price Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-gray-400 text-xs">Current Price</div>
                <div className="text-white text-lg">
                  ${marketData.price ? formatPrice(marketData.price) : 'N/A'}
                </div>
              </div>
              <div>
                <div className="text-gray-400 text-xs">24h Change</div>
                <div className={`text-lg ${
                  !marketData.change24h ? 'text-white' :
                  marketData.change24h >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {marketData.change24h ? 
                    `${marketData.change24h >= 0 ? '+' : ''}${marketData.change24h.toFixed(2)}%` : 
                    'N/A'
                  }
                </div>
              </div>
              <div>
                <div className="text-gray-400 text-xs">24h High</div>
                <div className="text-white">
                  ${marketData.high ? formatPrice(marketData.high) : 'N/A'}
                </div>
              </div>
              <div>
                <div className="text-gray-400 text-xs">24h Low</div>
                <div className="text-white">
                  ${marketData.low ? formatPrice(marketData.low) : 'N/A'}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded">
            <h3 className="text-theme text-sm mb-2">Volume Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-gray-400 text-xs">24h Volume</div>
                <div className="text-white">
                  ${marketData.volume24h ? formatVolume(marketData.volume24h) : 'N/A'}
                </div>
              </div>
              <div>
                <div className="text-gray-400 text-xs">Volume Change</div>
                <div className={`${
                  !marketData.volumeChange24h ? 'text-white' :
                  marketData.volumeChange24h >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {marketData.volumeChange24h ? 
                    `${marketData.volumeChange24h >= 0 ? '+' : ''}${marketData.volumeChange24h.toFixed(2)}%` :
                    'N/A'
                  }
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded">
            <h3 className="text-theme text-sm mb-2">Market Cap Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-gray-400 text-xs">Market Cap</div>
                <div className="text-white">
                  ${marketData.marketCap ? formatMarketCap(marketData.marketCap) : 'N/A'}
                </div>
              </div>
              <div>
                <div className="text-gray-400 text-xs">Market Cap Rank</div>
                <div className="text-white">
                  {marketData.marketCapRank ? `#${marketData.marketCapRank}` : 'N/A'}
                </div>
              </div>
              <div>
                <div className="text-gray-400 text-xs">Circulating Supply</div>
                <div className="text-white">
                  {marketData.circulatingSupply ? 
                    `${formatMarketCap(marketData.circulatingSupply)} ${baseAsset}` : 
                    'N/A'
                  }
                </div>
              </div>
              <div>
                <div className="text-gray-400 text-xs">Max Supply</div>
                <div className="text-white">
                  {marketData.maxSupply ? 
                    `${formatMarketCap(marketData.maxSupply)} ${baseAsset}` : 
                    '∞'
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};