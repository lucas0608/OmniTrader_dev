import { useCallback, useRef } from 'react';

interface LongPressOptions {
  onLongPress: (event: React.MouseEvent | React.TouchEvent) => void;
  onCancel?: () => void;
  delay?: number;
}

export const useLongPress = ({
  onLongPress,
  onCancel,
  delay = 500
}: LongPressOptions) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isPressed = useRef(false);
  const eventRef = useRef<React.MouseEvent | React.TouchEvent | null>(null);

  const start = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    isPressed.current = true;
    eventRef.current = event;
    
    timerRef.current = setTimeout(() => {
      if (isPressed.current && eventRef.current) {
        onLongPress(eventRef.current);
      }
    }, delay);
  }, [onLongPress, delay]);

  const cancel = useCallback(() => {
    isPressed.current = false;
    eventRef.current = null;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      onCancel?.();
    }
  }, [onCancel]);

  return {
    onMouseDown: start,
    onTouchStart: start,
    onMouseUp: cancel,
    onMouseLeave: cancel,
    onTouchEnd: cancel
  };
};