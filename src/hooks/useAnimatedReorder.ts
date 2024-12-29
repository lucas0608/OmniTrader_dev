import { useCallback } from 'react';

export const useAnimatedReorder = () => {
  const animateReorder = useCallback((fromIndex: number, toIndex: number) => {
    const panels = Array.from(document.querySelectorAll('.panel-container'));
    if (!panels.length || fromIndex === toIndex) return;

    const panelHeight = panels[0].getBoundingClientRect().height;
    const direction = toIndex > fromIndex ? 1 : -1;
    const draggedPanel = panels[fromIndex] as HTMLElement;

    // Reset all panels' transform before applying animations
    panels.forEach(panel => {
      const element = panel as HTMLElement;
      element.style.transition = '';
      element.style.transform = '';
    });

    panels.forEach((panel, index) => {
      const element = panel as HTMLElement;
      if (element === draggedPanel) return;

      const shouldAnimate =
        (direction > 0 && index > fromIndex && index <= toIndex) ||
        (direction < 0 && index < fromIndex && index >= toIndex);

      if (shouldAnimate) {
        const newTransform = `translateY(${direction * -panelHeight}px)`;
        element.style.transition = 'transform 0.3s ease-out';
        element.style.transform = newTransform;

        const handleTransitionEnd = () => {
          element.style.transition = '';
          element.style.transform = '';
          element.removeEventListener('transitionend', handleTransitionEnd);
        };

        element.addEventListener('transitionend', handleTransitionEnd);
      }
    });
  }, []);

  return { animateReorder };
};
