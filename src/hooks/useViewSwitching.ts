import { useEffect } from 'react';
import { usePanelStore } from '../store/panelStore';

export const useViewSwitching = () => {
  const { setMobileView, initializePositions } = usePanelStore();

  useEffect(() => {
    initializePositions();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setMobileView(window.innerWidth < 768);
    };

    // Initial check
    handleResize();

    // Add resize listener
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setMobileView]);
};