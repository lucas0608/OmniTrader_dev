import React from 'react';
import { formatVolume } from '../../../../utils/formatters';
import { MarketDataType } from '../../../../types/market';

interface VolumeSectionProps {
  data: MarketDataType;
}

export const VolumeSection: React.FC<VolumeSectionProps> = ({ data }) => (
  <div className="bg-gray-800 p-4 rounded">
    <h3 className="text-theme text-sm mb-3">Volume Information</h3>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <div className="text-gray-400 text-xs">24h Volume</div>
        <div className="text-white">${formatVolume(data.volume24h)}</div>
      </div>
      <div>
        <div className="text-gray-400 text-xs">Volume Change</div>
        <div className={`${data.volumeChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {data.volumeChange24h >= 0 ? '+' : ''}{data.volumeChange24h.toFixed(2)}%
        </div>
      </div>
    </div>
  </div>
);