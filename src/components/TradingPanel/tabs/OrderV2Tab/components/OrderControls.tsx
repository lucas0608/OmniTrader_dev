import React from 'react';
import { useUserStore } from '../../../../../store/userStore';

export const OrderControls = () => {
  const { algoEnabled, toggleAlgo } = useUserStore();

  return (
    <div className="grid grid-cols-4 gap-4">
      <div>
        <label className="text-white block mb-1 text-xs">Stop Loss</label>
        <input 
          type="number" 
          placeholder="%" 
          className="w-full bg-gray-700 text-white p-2 text-sm rounded" 
        />
      </div>
      <div>
        <label className="text-white block mb-1 text-xs">Take Profit</label>
        <input 
          type="number" 
          placeholder="%" 
          className="w-full bg-gray-700 text-white p-2 text-sm rounded" 
        />
      </div>
      <div>
        <label className="text-white block mb-1 text-xs">Auto-close</label>
        <select className="w-full bg-gray-700 text-white p-2 text-sm rounded">
          <option value="">Disabled</option>
          <option value="1h">1 hour</option>
          <option value="4h">4 hours</option>
          <option value="8h">8 hours</option>
          <option value="24h">24 hours</option>
        </select>
      </div>
      <div>
        <label className="text-white block mb-1 text-xs">ALGO</label>
        <button 
          onClick={toggleAlgo}
          className={`w-full h-8 rounded transition-colors ${
            algoEnabled ? 'bg-theme' : 'bg-gray-700'
          }`}
        />
      </div>
    </div>
  );
};