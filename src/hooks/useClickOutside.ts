import { useEffect, RefObject, useCallback } from 'react';

export const useClickOutside = (
  ref: RefObject<HTMLElement>,
  handler: () => void,
  excludeRef?: RefObject<HTMLElement>
) => {
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (!ref.current || ref.current.contains(event.target as Node)) {
      return;
    }

    if (excludeRef?.current?.contains(event.target as Node)) {
      return;
    }

    handler();
  }, [ref, handler, excludeRef]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);
};