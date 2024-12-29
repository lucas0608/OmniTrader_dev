// Corrected: usePanelDrag.ts to Address All Remaining Issues
import { useState, useCallback, useRef, useEffect } from 'react';
import { usePanelVisibility } from './usePanelVisibility';
import { useFilterStore } from '../store/filterStore';
import { useAnimatedReorder } from './useAnimatedReorder';
import { useDragDetection } from './useDragDetection';

interface DragState {
  startX: number;
  startY: number;
  initialRect: DOMRect;
}

interface Position {
  x: number;
  y: number;
}

export const usePanelDrag = (panelName: string) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const dragStartRef = useRef<DragState | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const dragLayerRef = useRef<HTMLDivElement | null>(null);

  const { panelOrder, updatePanelOrder } = usePanelVisibility();
  const { reorderItems } = useFilterStore();
  const { animateReorder } = useAnimatedReorder();
  const { getDragPosition, shouldReorder } = useDragDetection();

  const createDragLayer = useCallback((rect: DOMRect, content: HTMLElement) => {
    const layer = document.createElement('div');
    layer.style.position = 'fixed';
    layer.style.zIndex = '9999';
    layer.style.left = `${rect.left}px`;
    layer.style.top = `${rect.top}px`;
    layer.style.width = `${rect.width}px`;
    layer.style.height = `${rect.height}px`;
    layer.style.pointerEvents = 'none';
    layer.style.opacity = '0.95';
    layer.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
    layer.appendChild(content.cloneNode(true));
    document.body.appendChild(layer);
    return layer;
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!panelRef.current || !(e.target as HTMLElement).classList.contains('panel-header')) return;

    const rect = panelRef.current.getBoundingClientRect();
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialRect: rect
    };

    dragLayerRef.current = createDragLayer(rect, panelRef.current);

    setIsDragging(true);
    panelRef.current.style.opacity = '0';
    e.preventDefault();
  }, [createDragLayer]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !dragStartRef.current || !dragLayerRef.current) return;

    const deltaX = e.clientX - dragStartRef.current.startX;
    const deltaY = e.clientY - dragStartRef.current.startY;

    setPosition({ x: deltaX, y: deltaY });
    dragLayerRef.current.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

    const draggedPos = getDragPosition(dragLayerRef.current);
    const currentIndex = panelOrder.indexOf(panelName);

    document.querySelectorAll('.panel-container').forEach((panel) => {
      if (panel === panelRef.current) return;

      const targetName = panel.getAttribute('data-panel-name');
      if (!targetName) return;

      const targetIndex = panelOrder.indexOf(targetName);
      if (targetIndex === -1) return;

      const totalPanels = panelOrder.length;
      const targetPos = getDragPosition(panel as HTMLElement);

      if (shouldReorder(draggedPos, targetPos, currentIndex, targetIndex, totalPanels)) {
        reorderItems(currentIndex, targetIndex);
        animateReorder(currentIndex, targetIndex); // Trigger animation once
        updatePanelOrder([...panelOrder]); // Ensure real-time state update
      }
    });
  }, [isDragging, panelName, panelOrder, reorderItems, animateReorder, getDragPosition, shouldReorder, updatePanelOrder]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging || !panelRef.current || !dragLayerRef.current) return;

    setIsDragging(false);
    setPosition({ x: 0, y: 0 });
    dragStartRef.current = null;

    dragLayerRef.current?.remove();
    dragLayerRef.current = null;

    panelRef.current.style.opacity = '1';
    updatePanelOrder([...panelOrder]); // Apply the final state
  }, [isDragging, panelOrder, updatePanelOrder]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return {
    isDragging,
    position,
    panelRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  };
};
