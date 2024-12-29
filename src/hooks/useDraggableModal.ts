import { useState, useRef } from 'react';
import { useModalPosition } from './useModalPosition';

export const useDraggableModal = (modalId: string) => {
  const [isDragging, setIsDragging] = useState(false);
  const { position, updatePosition } = useModalPosition(modalId);
  const dragStartRef = useRef<{ y: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = {
      y: e.clientY - position.y
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && dragStartRef.current) {
      const newY = e.clientY - dragStartRef.current.y;
      const maxY = window.innerHeight - 100;
      const boundedY = Math.max(0, Math.min(newY, maxY));
      updatePosition(boundedY);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return {
    position,
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  };
};