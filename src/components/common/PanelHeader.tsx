import React from 'react';

interface PanelHeaderProps {
  title: string;
  showSettings?: boolean;
  onSettingsClick?: () => void;
  onToggle?: () => void;
  isCollapsed?: boolean;
  isSettingsActive?: boolean;
  disableCollapse?: boolean;
  onMouseDown?: (e: React.MouseEvent) => void;
}

export const PanelHeader: React.FC<PanelHeaderProps> = ({
  title,
  showSettings = false,
  onSettingsClick,
  onToggle,
  isCollapsed,
  isSettingsActive,
  disableCollapse,
  onMouseDown
}) => {
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disableCollapse && onToggle) {
      onToggle();
    }
  };

  return (
    <div 
      className="panel-header bg-theme text-black h-6 flex justify-between items-center text-sm px-1 select-none cursor-grab active:cursor-grabbing"
      onMouseDown={onMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      <span className="font-bold">{title}</span>
      {showSettings ? (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onSettingsClick?.();
          }}
          className="w-4 h-4 flex items-center justify-center cursor-pointer"
        >
          {isSettingsActive ? (
            <span className="text-lg leading-none">←</span>
          ) : (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      ) : !disableCollapse && (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggle?.();
          }}
          className="w-4 h-4 flex items-center justify-center cursor-pointer"
        >
          {isCollapsed ? '+' : '-'}
        </button>
      )}
    </div>
  );
};