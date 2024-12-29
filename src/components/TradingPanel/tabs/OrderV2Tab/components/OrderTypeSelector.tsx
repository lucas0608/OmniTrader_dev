import React from 'react';

interface OrderTypeSelectorProps {
  orderType: 'market' | 'limit';
  onOrderTypeChange: (type: 'market' | 'limit') => void;
}

export const OrderTypeSelector: React.FC<OrderTypeSelectorProps> = ({
  orderType,
  onOrderTypeChange
}) => (
  <div className="flex gap-2">
    <button 
      className={`flex-1 py-2 text-sm ${
        orderType === 'market' 
          ? 'bg-theme text-black cursor-default' 
          : 'bg-gray-700 text-white hover:bg-gray-600'
      }`}
      onClick={() => onOrderTypeChange('market')}
    >
      Market
    </button>
    <button 
      className={`flex-1 py-2 text-sm ${
        orderType === 'limit' 
          ? 'bg-theme text-black cursor-default' 
          : 'bg-gray-700 text-white hover:bg-gray-600'
      }`}
      onClick={() => onOrderTypeChange('limit')}
    >
      Limit
    </button>
  </div>
);