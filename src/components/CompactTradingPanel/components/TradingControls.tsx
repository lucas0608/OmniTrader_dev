import React, { useState } from 'react';
import { useUserStore } from '../../../store/userStore';

export const TradingControls = () => {
  const [mode, setMode] = useState<'force' | 'open' | null>(null);
  const [position, setPosition] = useState<'call' | 'put' | null>(null);
  const [sync, setSync] = useState(false);
  const { algoEnabled, toggleAlgo } = useUserStore();

  const handleReset = () => {
    setMode(null);
    setPosition(null);
    setSync(false);
    if (algoEnabled) toggleAlgo();
  };

  const buttonBaseClass = "py-1 text-[10px] sm:text-sm rounded transition-colors";
  const toggleBaseClass = "w-8 sm:w-12 h-4 sm:h-6 rounded-full relative transition-colors";
  const toggleKnobClass = "w-3 sm:w-5 h-3 sm:h-5 rounded-full bg-white absolute top-0.5 transition-transform";

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-4 gap-1">
        <button
          onClick={() => setMode(mode === 'force' ? null : 'force')}
          className={`${buttonBaseClass} ${
            mode === 'force' 
              ? 'bg-theme text-black' 
              : 'bg-gray-700 text-white hover:bg-gray-600'
          }`}
        >
          FORCE
        </button>
        <button
          onClick={() => setMode(mode === 'open' ? null : 'open')}
          className={`${buttonBaseClass} ${
            mode === 'open' 
              ? 'bg-theme text-black' 
              : 'bg-gray-700 text-white hover:bg-gray-600'
          }`}
        >
          OPEN
        </button>
        <button
          onClick={() => setPosition(position === 'call' ? null : 'call')}
          className={`${buttonBaseClass} ${
            position === 'call' 
              ? 'bg-green-500 text-black' 
              : 'bg-gray-700 text-white hover:bg-gray-600'
          }`}
        >
          CALL
        </button>
        <button
          onClick={() => setPosition(position === 'put' ? null : 'put')}
          className={`${buttonBaseClass} ${
            position === 'put' 
              ? 'bg-red-500 text-black' 
              : 'bg-gray-700 text-white hover:bg-gray-600'
          }`}
        >
          PUT
        </button>
      </div>

      <div className="flex items-center justify-between gap-2">
        <button
          onClick={handleReset}
          className={`${buttonBaseClass} bg-red-500 text-white px-2 sm:px-4 hover:bg-red-600 min-w-[40px] sm:min-w-[60px]`}
        >
          RESET
        </button>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="text-white text-[10px] sm:text-sm">SYNC</span>
            <button
              onClick={() => setSync(!sync)}
              className={`${toggleBaseClass} ${sync ? 'bg-theme' : 'bg-gray-600'}`}
            >
              <div className={`${toggleKnobClass} ${sync ? 'right-0.5' : 'left-0.5'}`} />
            </button>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <span className="text-white text-[10px] sm:text-sm">ALGO</span>
            <button
              onClick={toggleAlgo}
              className={`${toggleBaseClass} ${algoEnabled ? 'bg-theme' : 'bg-gray-600'}`}
            >
              <div className={`${toggleKnobClass} ${algoEnabled ? 'right-0.5' : 'left-0.5'}`} />
            </button>
          </div>
        </div>

        <button className={`${buttonBaseClass} bg-blue-500 text-white px-2 sm:px-4 hover:bg-blue-600 min-w-[40px] sm:min-w-[60px]`}>
          SETTLE
        </button>
      </div>
    </div>
  );
};