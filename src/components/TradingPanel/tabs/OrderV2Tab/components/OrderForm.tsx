import React, { useState, useEffect } from 'react';
import { OrderTypeSelector } from './OrderTypeSelector';
import { PositionSelector } from './PositionSelector';
import { OrderInputs } from './OrderInputs';

interface OrderFormProps {
  selectedPrice?: string;
}

export const OrderForm: React.FC<OrderFormProps> = ({ selectedPrice }) => {
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [position, setPosition] = useState<'long' | 'short'>('long');

  return (
    <div className="space-y-4">
      <OrderTypeSelector 
        orderType={orderType}
        onOrderTypeChange={setOrderType}
      />
      
      <PositionSelector 
        position={position}
        onPositionChange={setPosition}
      />

      <OrderInputs 
        orderType={orderType}
        position={position}
        selectedPrice={selectedPrice}
      />
    </div>
  );
};