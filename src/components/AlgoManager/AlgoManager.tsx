import React from 'react';
import { Panel } from '../common/Panel';
import { AlgoList } from './AlgoList';
import { AlgoSearch } from './AlgoSearch';
import { useAlgoManagerStore } from '../../store/algoManagerStore';

export const AlgoManager = () => {
  const {
    managedAlgos,
    selectedAlgos,
    isUnlocked,
    addAlgo,
    removeAlgo,
    toggleAlgoSelection
  } = useAlgoManagerStore();

  return (
    <Panel title="ALGO MANAGER">
      <div className="space-y-4">
        {isUnlocked && (
          <AlgoSearch
            existingAlgos={managedAlgos.map(a => a.name)}
            onAddAlgo={addAlgo}
          />
        )}

        <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-4 text-theme text-sm mb-2">
          <div>ALGO</div>
          <div className="text-center">CLASS</div>
          <div className="text-center">STATUS</div>
          <div></div>
        </div>
        
        <AlgoList
          algos={managedAlgos}
          isUnlocked={isUnlocked}
          selectedAlgos={selectedAlgos}
          onToggleSelect={toggleAlgoSelection}
          onRemoveAlgo={removeAlgo}
        />
      </div>
    </Panel>
  );
};