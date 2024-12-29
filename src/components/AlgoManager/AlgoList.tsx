import React, { useState } from 'react';
import { ManagedAlgo } from '../../types/algo';
import { AlgoDetailsWindow } from './AlgoDetailsWindow';
import { useUserStore } from '../../store/userStore';
import '../AccountManager/checkbox.css';

interface AlgoListProps {
  algos: ManagedAlgo[];
  isUnlocked: boolean;
  selectedAlgos: string[];
  onToggleSelect: (name: string) => void;
  onRemoveAlgo: (name: string) => void;
}

export const AlgoList: React.FC<AlgoListProps> = ({
  algos,
  isUnlocked,
  selectedAlgos,
  onToggleSelect,
  onRemoveAlgo
}) => {
  const [selectedAlgo, setSelectedAlgo] = useState<ManagedAlgo | null>(null);
  const { currentUser } = useUserStore();

  const handleAlgoClick = (algo: ManagedAlgo, event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains('algo-name')) {
      setSelectedAlgo(algo);
    }
  };

  return (
    <div className="space-y-2">
      {algos.map((algo, index) => (
        <div
          key={algo.name}
          className={`grid grid-cols-[1fr_1fr_1fr_auto] gap-4 items-center text-theme text-sm p-2 ${
            index % 2 === 0 ? 'bg-[#262626]' : 'bg-[#1a1a1a]'
          }`}
          onClick={(e) => handleAlgoClick(algo, e)}
        >
          <div className="flex items-center gap-2 min-w-0">
            <label className="custom-checkbox flex-shrink-0">
              <input
                type="checkbox"
                checked={selectedAlgos.includes(algo.name)}
                onChange={() => onToggleSelect(algo.name)}
                disabled={!isUnlocked}
              />
              <span className="checkmark">
                <span></span>
              </span>
            </label>
            <span className="truncate algo-name cursor-pointer hover:text-theme/80">
              {algo.name}
            </span>
          </div>
          <div className="text-center">[{algo.class}]</div>
          <div className={`text-center ${algo.status.color || ''}`}>
            {algo.status.text}
          </div>
          <div className="flex justify-end w-4">
            {isUnlocked && (
              <button
                onClick={() => onRemoveAlgo(algo.name)}
                className="text-red-500 hover:text-red-400 flex items-center justify-center"
              >
                ×
              </button>
            )}
          </div>
        </div>
      ))}

      {selectedAlgo && currentUser && (
        <AlgoDetailsWindow
          algo={selectedAlgo}
          isAdmin={currentUser.class === 'Admin'}
          onClose={() => setSelectedAlgo(null)}
        />
      )}
    </div>
  );
};