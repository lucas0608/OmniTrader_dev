import { useState, useEffect } from 'react';
import { useUserStore } from '../store/userStore';

interface Position {
  y: number;
}

export const useDraggableY = (initialY: number = 0) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState<Position>({ y: initialY });
  const [dragStart, setDragStart] = useState<Position | null>(null);
  const { settings, updateUserSettings } = useUserStore();

  useEffect(() => {
    // Initialize position from settings if available
    if (settings.modalPosition?.y !== undefined) {
      setPosition({ y: settings.modalPosition.y });
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && dragStart) {
      const newY = e.clientY - dragStart.y;
      
      // Prevent dragging beyond screen bounds
      const maxY = window.innerHeight - 100; // Leave some space at bottom
      const boundedY = Math.max(0, Math.min(newY, maxY));
      
      setPosition({ y: boundedY });
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      // Save position to user settings
      updateUserSettings({ modalPosition: position });
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart]);

  return {
    position,
    isDragging,
    handleMouseDown
  };
};