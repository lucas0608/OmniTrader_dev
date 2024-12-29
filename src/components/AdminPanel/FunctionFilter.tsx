import React, { useState } from 'react';
import { Panel } from '../common/Panel';
import { FilterItem } from './FilterItem';
import { usePanelVisibility } from '../../hooks/usePanelVisibility';
import { useFilterStore } from '../../store/filterStore';
import { DragInfo } from '../../types/filter';
import './FunctionFilter.css';

export const FunctionFilter = () => {
  const { visiblePanels, togglePanel } = usePanelVisibility();
  const { items, reorderItems, resetOrder, applyPendingOrder } = useFilterStore();
  const [dragInfo, setDragInfo] = useState<DragInfo | null>(null);

  const handleDragStart = (e: React.MouseEvent, index: number) => {
    const item = items[index];
    const superOverrideIndex = items.findIndex(i => i.blocked);

    if (item.blocked || index >= superOverrideIndex) {
      return;
    }

    setDragInfo({
      index,
      startY: e.clientY
    });
  };

  const handleDragMove = (e: MouseEvent) => {
    if (!dragInfo) return;

    const currentY = e.clientY;
    const deltaY = currentY - dragInfo.startY;
    const itemHeight = 40;

    if (Math.abs(deltaY) > itemHeight / 2) {
      const direction = deltaY > 0 ? 1 : -1;
      const newIndex = dragInfo.index + direction;
      const superOverrideIndex = items.findIndex(item => item.blocked);

      if (newIndex >= 0 && newIndex < superOverrideIndex) {
        reorderItems(dragInfo.index, newIndex);
        setDragInfo({
          index: newIndex,
          startY: currentY
        });
      }
    }
  };

  const handleDragEnd = () => {
    setDragInfo(null);
  };

  React.useEffect(() => {
    if (dragInfo) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
    };
  }, [dragInfo]);

  // Filter out the Function Filter item
  const visibleItems = items.filter(item => item.name !== 'FUNCTION FILTER');

  return (
    <Panel title="FUNCTION FILTER">
      <div className="space-y-0">
        <div className="flex justify-end mb-4">
          <button
            onClick={resetOrder}
            className="text-theme hover:text-theme/80 text-sm mr-2"
          >
            Reset Order
          </button>
          <button
            onClick={applyPendingOrder}
            className="text-theme hover:text-theme/80 text-sm"
          >
            Apply Order
          </button>
        </div>
        {visibleItems.map((item, index) => (
          <FilterItem
            key={item.name}
            item={item}
            isActive={visiblePanels[item.name]}
            onToggle={() => togglePanel(item.name)}
            onDragStart={handleDragStart}
            index={index}
            onReorder={reorderItems}
          />
        ))}
      </div>
    </Panel>
  );
};
