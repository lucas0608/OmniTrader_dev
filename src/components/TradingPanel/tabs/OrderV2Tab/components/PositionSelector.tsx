import React from 'react';

interface PositionSelectorProps {
  position: 'long' | 'short';
  onPositionChange: (position: 'long' | 'short') => void;
}

export const PositionSelector: React.FC<PositionSelectorProps> = ({
  position,
  onPositionChange
}) => (
  <div className="flex gap-2">
    <button 
      className={`flex-1 py-2 text-sm ${
        position === 'long' 
          ? 'bg-green-500 text-black cursor-default' 
          : 'bg-gray-700 text-white hover:bg-gray-600'
      }`}
      onClick={() => onPositionChange('long')}
    >
      Long
    </button>
    <button 
      className={`flex-1 py-2 text-sm ${
        position === 'short' 
          ? 'bg-red-500 text-black cursor-default' 
          : 'bg-gray-700 text-white hover:bg-gray-600'
      }`}
      onClick={() => onPositionChange('short')}
    >
      Short
    </button>
  </div>
);