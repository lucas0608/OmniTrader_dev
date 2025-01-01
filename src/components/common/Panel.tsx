import React from 'react';
import { PanelHeader } from './PanelHeader';
import { useCollapsible } from '../../hooks/useCollapsible';
import { usePanelDrag } from '../../hooks/usePanelDrag';
import { usePanelStore } from '../../store/panelStore';

interface PanelProps {
  title: string;
  setId?: number;
  showSettings?: boolean;
  onSettingsClick?: () => void;
  isSettingsActive?: boolean;
  children: React.ReactNode;
  disableCollapse?: boolean;
}

export const Panel: React.FC<PanelProps> = ({
  title,
  setId,
  showSettings,
  onSettingsClick,
  isSettingsActive,
  children,
  disableCollapse
}) => {
  const panelName = setId !== undefined ? `${title}_SET${setId}` : title;
  const { isCollapsed, toggle } = useCollapsible(title);
  const { isMobileView, panelStates, setActivePanel } = usePanelStore();
  const {
    isDragging,
    panelRef,
    handleMouseDown,
    handleTouchStart
  } = usePanelDrag(title, setId);

  const panelState = panelStates[panelName];
  const style = !isMobileView && panelState ? {
    transform: `translate(${panelState.position.x}px, ${panelState.position.y}px)`,
    zIndex: panelState.zIndex || 1,
    width: '448px' // Fixed width in desktop mode
  } : undefined;

  const handlePanelClick = () => {
    if (!isMobileView) {
      setActivePanel(title);
    }
  };

  return (
    <div
      ref={panelRef}
      className={`
        panel-container mb-4 
        ${isDragging ? 'dragging' : ''} 
        ${!isMobileView ? 'fixed' : 'w-full max-w-md mx-auto'}
      `}
      style={style}
      data-panel-name={title}
      onClick={handlePanelClick}
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
        onTouchStart={handleTouchStart}
      />
      {!isCollapsed && (
        <div className="bg-[#1a1a1a] border border-theme p-4">
          {children}
        </div>
      )}
    </div>
  );
};