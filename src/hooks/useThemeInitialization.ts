import { useEffect } from 'react';
import { useUserStore } from '../store/userStore';

export const useThemeInitialization = () => {
  const { settings } = useUserStore();

  useEffect(() => {
    // Initialize theme color from stored settings
    document.documentElement.style.setProperty('--primary-color', settings.themeColor);
  }, [settings.themeColor]); // Re-run when theme color changes
};