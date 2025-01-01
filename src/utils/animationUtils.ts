export const animatePanel = (panel: HTMLElement, direction: number): void => {
  const height = panel.getBoundingClientRect().height;
  panel.style.transition = 'transform 0.2s ease-out';
  panel.style.transform = `translateY(${-direction * height}px)`;
};

export const applyDraggingStyles = (panel: HTMLElement): void => {
  panel.classList.add('dragging');
  panel.style.zIndex = '1000';
  panel.style.transition = 'none';
  panel.style.pointerEvents = 'none';
};

export const removeDraggingStyles = (panel: HTMLElement): void => {
  panel.classList.remove('dragging');
  panel.style.zIndex = '';
  panel.style.transition = '';
  panel.style.transform = '';
  panel.style.pointerEvents = '';
};

export const resetPanelAnimations = (panels: HTMLElement[]): void => {
  panels.forEach(panel => {
    panel.style.transition = '';
    panel.style.transform = '';
  });
};