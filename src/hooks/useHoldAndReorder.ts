import { useState, useCallback, useRef } from 'react';

export const useHoldAndReorder = (onReorder: (fromIndex: number, toIndex: number) => void) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragIndexRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTouchStart = useCallback((index: number, e: React.TouchEvent) => {
    e.preventDefault(); // Prevent default touch behavior
    dragIndexRef.current = index;
    
    // Start hold timer
    timeoutRef.current = setTimeout(() => {
      setIsDragging(true);
    }, 200); // 200ms hold time to initiate drag
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || dragIndexRef.current === null) return;

    const touch = e.touches[0];
    const elements = document.elementsFromPoint(touch.clientX, touch.clientY);
    
    // Find the closest draggable item
    const draggableItem = elements.find(el => el.hasAttribute('data-index'));
    
    if (draggableItem) {
      const toIndex = parseInt(draggableItem.getAttribute('data-index') || '0', 10);
      if (toIndex !== dragIndexRef.current) {
        onReorder(dragIndexRef.current, toIndex);
        dragIndexRef.current = toIndex;
      }
    }
  }, [isDragging, onReorder]);

  const handleTouchEnd = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsDragging(false);
    dragIndexRef.current = null;
  }, []);

  return {
    isDragging,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  };
};