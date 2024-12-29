import React, { useEffect } from 'react';
import { PanelHeader } from './PanelHeader';
import { useCollapsible } from '../../hooks/useCollapsible';
import { usePanelDrag } from '../../hooks/usePanelDrag';

interface PanelProps {
  title: string;
  showSettings?: boolean;
  onSettingsClick?: () => void;
  isSettingsActive?: boolean;
  children: React.ReactNode;
  disableCollapse?: boolean;
}

export const Panel: React.FC<PanelProps> = ({
  title,
  showSettings,
  onSettingsClick,
  isSettingsActive,
  children,
  disableCollapse
}) => {
  const { isCollapsed, toggle } = useCollapsible(title);
  const {
    isDragging,
    position,
    panelRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  } = usePanelDrag(title);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={panelRef}
      className={`panel-container mb-4 ${isDragging ? 'dragging' : ''}`}
      data-panel-name={title}
      style={{
        transform: isDragging ? `translate(${position.x}px, ${position.y}px)` : undefined
      }}
    >
      <PanelHeader 
        title={title}
        showSettings={showSettings}
        onSettingsClick={onSettingsClick}
        onToggle={toggle}
        isCollapsed={isCollapsed}
        isSettingsActive={isSettingsActive}
        disableCollapse={disableCollapse}
        onMouseDown={handleMouseDown}
      />
      {!isCollapsed && (
        <div className="bg-[#1a1a1a] border border-theme p-4">
          {children}
        </div>
      )}
    </div>
  );
};