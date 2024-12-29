import { useEffect } from 'react';
import { useUserStore } from '../store/userStore';

export const useLogoManagement = () => {
  const { settings } = useUserStore();

  useEffect(() => {
    const logoElement = document.querySelector('img[alt="OMNI TRADER"]') as HTMLImageElement;
    if (!logoElement) return;

    // Get preset color index (1-based)
    const presetIndex = settings.presetColors.indexOf(settings.themeColor) + 1;
    
    // Set logo based on preset color selection
    if (presetIndex > 0) {
      logoElement.src = `/logo_${presetIndex}.svg`;
    } else {
      logoElement.src = '/logo.svg';
    }
  }, [settings.themeColor]);
};