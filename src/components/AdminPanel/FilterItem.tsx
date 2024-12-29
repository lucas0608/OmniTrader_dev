import React, { useRef } from 'react';
import { FilterItem as FilterItemType } from '../../types/filter';
import { useHoldAndReorder } from '../../hooks/useHoldAndReorder';

interface FilterItemProps {
  item: FilterItemType;
  isActive: boolean;
  onToggle: () => void;
  onDragStart: (e: React.MouseEvent, index: number) => void;
  index: number;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

export const FilterItem: React.FC<FilterItemProps> = ({
  item,
  isActive,
  onToggle,
  onDragStart,
  index,
  onReorder
}) => {
  const isAdminOrFunction = item.name === 'ADMIN PANEL' || item.name === 'FUNCTION FILTER';
  const {
    isDragging,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  } = useHoldAndReorder(onReorder);

  const handleDragClick = (e: React.MouseEvent) => {
    if (!item.blocked) {
      onDragStart(e, index);
    }
  };

  return (
    <div 
      className={`flex items-center justify-between py-2 px-3 ${
        index % 2 === 0 ? 'bg-[#262626]' : 'bg-[#1a1a1a]'
      } ${isDragging ? 'opacity-50' : ''}`}
      data-index={index}
    >
      <span className="text-sm text-theme">{item.name}</span>
      
      <div className="flex items-center gap-2">
        {item.blocked ? (
          <span className="text-gray-500">BLOCKED</span>
        ) : (
          <>
            <label className="custom-checkbox">
              <input
                type="checkbox"
                checked={isAdminOrFunction ? true : isActive}
                onChange={onToggle}
                disabled={isAdminOrFunction}
              />
              <span className="checkmark">
                <span></span>
              </span>
            </label>
            <button
              className="cursor-grab active:cursor-grabbing text-theme hover:text-theme/80 px-1 select-none touch-none"
              onMouseDown={handleDragClick}
              onTouchStart={(e) => handleTouchStart(index, e)}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              data-index={index}
            >
              ⋮⋮
            </button>
          </>
        )}
      </div>
    </div>
  );
};