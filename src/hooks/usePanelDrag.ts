import { useState, useCallback, useRef, useEffect } from 'react';
import { usePanelVisibility } from './usePanelVisibility';
import { usePanelStore } from '../store/panelStore';
import { useFilterStore } from '../store/filterStore';
import { DragState, PanelPosition } from '../types/panel';

const PANEL_WIDTH = 448;
const PANEL_GAP = 32;
const SET_GAP = 64;

export const usePanelDrag = (panelName: string, setId?: number) => {
  const [isDragging, setIsDragging] = useState(false);
  // Create unique drag state for each panel
  const dragStateRef = useRef<DragState | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const { updatePanelOrder } = usePanelVisibility();
  const { panelStates, setPanelPosition, isMobileView } = usePanelStore();
  const { reorderItems } = useFilterStore();

  const startDrag = useCallback((clientX: number, clientY: number) => {
    if (!panelRef.current) return;
    
    const currentSetId = setId || 0;
    const panelKey = `${panelName}_${currentSetId}`;

    const panels = Array.from(document.querySelectorAll('.panel-container'));
    // Only get panels from the same set
    const setPanels = panels.filter(panel => {
      const name = panel.getAttribute('data-panel-name') || '';
      const match = name.match(/_SET(\d+)$/);
      return match ? parseInt(match[1]) === currentSetId : !currentSetId;
    });

    const startIndex = setPanels.indexOf(panelRef.current);
    const currentPosition = panelStates[panelName]?.position || { x: 0, y: 0 };

    dragStateRef.current = {
      key: panelKey,
      startX: clientX,
      startY: clientY,
      startIndex,
      initialPosition: currentPosition,
      setId: currentSetId
    };

    setIsDragging(true);
    panelRef.current.style.zIndex = '1000';
    panelRef.current.style.opacity = '0.8';
  }, [panelName, panelStates, setId]);

  const onDragMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging || !dragStateRef.current || !panelRef.current) return;
    
    const { clientX, clientY } = 'touches' in e ? e.touches[0] : e;
    const deltaX = clientX - dragStateRef.current.startX;
    const deltaY = clientY - dragStateRef.current.startY;
    const currentSetId = setId || 0;

    if (isMobileView) {
      panelRef.current.style.transform = `translateY(${deltaY}px)`;
    } else {
      // Only allow horizontal movement within set boundaries
      const newX = dragStateRef.current.initialPosition.x + deltaX;
      const newY = dragStateRef.current.initialPosition.y + deltaY;
      
      const minX = currentSetId * (PANEL_WIDTH + SET_GAP);
      const maxX = minX + PANEL_WIDTH * 2 + PANEL_GAP;
      const boundedX = Math.max(minX, Math.min(maxX, newX));
      
      panelRef.current.style.transform = `translate(${boundedX}px, ${newY}px)`;
    }
  }, [isDragging, isMobileView]);

  const onDragEnd = useCallback(() => {
    if (!isDragging || !dragStateRef.current || !panelRef.current) return;

    const currentSetId = dragStateRef.current.setId;

    if (isMobileView) {
      // Mobile: Handle vertical reordering
      const panels = Array.from(document.querySelectorAll('.panel-container'));
      
      // Filter panels by set ID for mobile view
      const setPanels = panels.filter(panel => {
        const name = panel.getAttribute('data-panel-name') || '';
        const match = name.match(/_SET(\d+)$/);
        const panelSetId = match ? parseInt(match[1]) : 0;
        return panelSetId === currentSetId;
      });

      const currentY = panelRef.current.getBoundingClientRect().top;
      let targetIndex = dragStateRef.current.startIndex;

      setPanels.forEach((p, index) => {
        const rect = p.getBoundingClientRect();
        const midpoint = rect.top + rect.height / 2;
        if (currentY < midpoint && index < targetIndex) targetIndex = index;
        if (currentY > midpoint && index > targetIndex) targetIndex = index;
      });

      if (targetIndex !== dragStateRef.current.startIndex) {
        const newOrder = [...setPanels]
          .map(p => p.getAttribute('data-panel-name'))
          .filter((name): name is string => !!name);
        
        const [moved] = newOrder.splice(dragStateRef.current.startIndex, 1);
        newOrder.splice(targetIndex, 0, moved);
        updatePanelOrder(newOrder);
        
        // Sync with Function Filter
        const { reorderItems } = useFilterStore.getState();
        if (isMobileView) {
          // Convert panel indices to filter indices
          const filterStartIndex = dragStateRef.current.startIndex;
          const filterTargetIndex = targetIndex;
          reorderItems(filterStartIndex, filterTargetIndex);
        }
      }

      // Reset panel styles
      panelRef.current.style.transform = '';
    } else {
      // Desktop: Save new position
      const transform = panelRef.current.style.transform;
      const match = transform.match(/translate\((-?\d+(?:\.\d+)?)px,\s*(-?\d+(?:\.\d+)?)px\)/);
      
      if (match) {
        const position: PanelPosition = {
          x: parseFloat(match[1]),
          y: parseFloat(match[2]),
          setId: currentSetId
        };
        setPanelPosition(panelName, position);
      }
    }

    setIsDragging(false);
    panelRef.current.style.zIndex = '';
    panelRef.current.style.opacity = '';
    // Reset drag state to initial values instead of null
    dragStateRef.current = {
      startX: 0,
      startY: 0,
      startIndex: 0,
      setId: setId || 0,
      initialPosition: { x: 0, y: 0 }
    };
  }, [isDragging, isMobileView, panelName, setPanelPosition, updatePanelOrder]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!(e.target as HTMLElement).classList.contains('panel-header')) return;
    e.preventDefault();
    startDrag(e.clientX, e.clientY);
  }, [panelName, panelStates]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!(e.target as HTMLElement).classList.contains('panel-header')) return;
    const touch = e.touches[0];
    startDrag(touch.clientX, touch.clientY);
  }, [startDrag]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', onDragMove);
      window.addEventListener('mouseup', onDragEnd);
      window.addEventListener('touchmove', onDragMove, { passive: false });
      window.addEventListener('touchend', onDragEnd);
    }
    return () => {
      window.removeEventListener('mousemove', onDragMove);
      window.removeEventListener('mouseup', onDragEnd);
      window.removeEventListener('touchmove', onDragMove);
      window.removeEventListener('touchend', onDragEnd);
    };
  }, [isDragging, onDragMove, onDragEnd]);

  // Apply saved position on mount (desktop only)
  useEffect(() => {
    if (!isMobileView && panelRef.current) {
      const savedPosition = panelStates[panelName]?.position;
      if (savedPosition) {
        panelRef.current.style.transform = `translate(${savedPosition.x}px, ${savedPosition.y}px)`;
      }
    }
  }, [panelName, panelStates, isMobileView]);

  return {
    isDragging,
    panelRef,
    handleMouseDown,
    handleTouchStart
  };
};