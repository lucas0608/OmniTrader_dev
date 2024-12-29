import React, { useRef } from 'react';
import { useMarketData } from './hooks/useMarketData';
import { PriceSection } from './sections/PriceSection';
import { VolumeSection } from './sections/VolumeSection';
import { MarketCapSection } from './sections/MarketCapSection';
import { LoadingSpinner } from '../../../common/LoadingSpinner';
import { useDraggableY } from '../../../../hooks/useDraggableY';
import { useClickOutside } from '../../../../hooks/useClickOutside';

interface MarketDataModalProps {
  symbol: string;
  onClose: () => void;
}

export const MarketDataModal: React.FC<MarketDataModalProps> = ({ symbol, onClose }) => {
  const { data, isLoading, error } = useMarketData(symbol);
  const { position, handleMouseDown } = useDraggableY();
  const modalRef = useRef<HTMLDivElement>(null);

  useClickOutside(modalRef, onClose);

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
          <h2 className="text-theme text-sm">{symbol} Market Data</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">×</button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-4">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">{error}</div>
        ) : data && (
          <div className="space-y-2">
            <PriceSection data={data} />
            <VolumeSection data={data} />
            <MarketCapSection data={data} />
          </div>
        )}
      </div>
    </div>
  );
};