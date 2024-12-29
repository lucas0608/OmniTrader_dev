import React, { useState } from 'react';
import { predefinedAlgos } from '../../data/algos';

interface AlgoSearchProps {
  existingAlgos: string[];
  onAddAlgo: (name: string) => void;
}

export const AlgoSearch: React.FC<AlgoSearchProps> = ({
  existingAlgos,
  onAddAlgo
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAlgos = predefinedAlgos
    .filter(algo => 
      !existingAlgos.includes(algo.name) &&
      algo.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="flex gap-2">
      <div className="relative flex-grow">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search algos..."
          className="w-full bg-gray-700 text-white p-1 text-sm"
        />
        {searchTerm && filteredAlgos.length > 0 && (
          <div className="absolute w-full bg-gray-800 mt-1 border border-gray-700 max-h-32 overflow-y-auto">
            {filteredAlgos.map(algo => (
              <div
                key={algo.name}
                className="p-2 hover:bg-gray-700 cursor-pointer text-white text-sm"
                onClick={() => {
                  onAddAlgo(algo.name);
                  setSearchTerm('');
                }}
              >
                {algo.name} [{algo.class}]
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};