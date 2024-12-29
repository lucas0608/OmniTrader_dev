import { useState, useEffect } from 'react';
import { useUserStore } from '../store/userStore';

interface ModalPosition {
  id: string;
  y: number;
}

export const useModalPosition = (modalId: string) => {
  const { settings, updateUserSettings } = useUserStore();
  const [position, setPosition] = useState<{ y: number }>({ y: 0 });

  useEffect(() => {
    const savedPosition = settings.modalPositions?.[modalId];
    if (savedPosition?.y !== undefined) {
      setPosition({ y: savedPosition.y });
    }
  }, [modalId]);

  const updatePosition = (newY: number) => {
    setPosition({ y: newY });
    const updatedPositions = {
      ...settings.modalPositions,
      [modalId]: { y: newY }
    };
    updateUserSettings({ modalPositions: updatedPositions });
  };

  return { position, updatePosition };
};