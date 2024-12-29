import React, { useState, useRef } from 'react';
import { useDraggableY } from '../../hooks/useDraggableY';
import { useClickOutside } from '../../hooks/useClickOutside';

interface CryptoSelectorProps {
  onSelect: (symbol: string) => void;
  onClose: () => void;
}

export const CryptoSelector: React.FC<CryptoSelectorProps> = ({ onSelect, onClose }) => {
  const [search, setSearch] = useState('');
  const popularCryptos = ['BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'DOGE'];
  const { position, handleMouseDown } = useDraggableY();
  const modalRef = useRef<HTMLDivElement>(null);

  useClickOutside(modalRef, onClose);

  const filteredCryptos = search
    ? popularCryptos.filter(crypto => 
        crypto.toLowerCase().includes(search.toLowerCase())
      )
    : popularCryptos;

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
          <h2 className="text-theme text-sm">Select Cryptocurrency</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">×</button>
        </div>
        
        <input
          type="text"
          placeholder="Search crypto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-gray-700 text-white p-2 mb-4 text-sm rounded"
        />
        
        <div className="grid grid-cols-2 gap-2">
          {filteredCryptos.map((crypto) => (
            <button
              key={crypto}
              onClick={() => onSelect(crypto)}
              className="bg-gray-700 text-white p-2 text-sm hover:bg-gray-600 rounded"
            >
              {crypto}/USDT
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};