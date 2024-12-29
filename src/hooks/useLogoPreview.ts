import { useState, useEffect } from 'react';
import { useUserStore } from '../store/userStore';

export const useLogoPreview = () => {
  const { settings } = useUserStore();
  const [previousLogo, setPreviousLogo] = useState<string>('');

  const updateLogo = (color: string) => {
    const logoElement = document.querySelector('img[alt="OMNI TRADER"]') as HTMLImageElement;
    if (!logoElement) return;

    // Save current logo if we haven't yet
    if (!previousLogo) {
      setPreviousLogo(logoElement.src);
    }

    // Get preset color index (1-based)
    const presetIndex = settings.presetColors.indexOf(color) + 1;
    
    // Set logo based on preset color selection
    if (presetIndex > 0) {
      logoElement.src = `/logo_${presetIndex}.svg`;
    } else {
      logoElement.src = '/logo.svg';
    }
  };

  const revertLogo = () => {
    if (previousLogo) {
      const logoElement = document.querySelector('img[alt="OMNI TRADER"]') as HTMLImageElement;
      if (logoElement) {
        logoElement.src = previousLogo;
      }
      setPreviousLogo('');
    }
  };

  return { updateLogo, revertLogo };
};