import { useEffect } from 'react';
import { useUserStore } from '../store/userStore';

export const useThemeColor = () => {
  const { settings } = useUserStore();

  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', settings.themeColor);
  }, [settings.themeColor]);

  return settings.themeColor;
};