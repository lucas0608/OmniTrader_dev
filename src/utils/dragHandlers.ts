import { DragState } from '../types/panel';

export const handleDragMove = (panel: HTMLElement, deltaY: number) => {
  panel.style.transform = `translateY(${deltaY}px)`;
};

export const handleDragEnd = (
  panel: HTMLElement,
  dragState: DragState,
  updatePanelOrder: (order: string[]) => void
) => {
  const panels = Array.from(document.querySelectorAll('.panel-container'));
  const currentY = panel.getBoundingClientRect().top;
  let targetIndex = dragState.startIndex;

  panels.forEach((p, index) => {
    if (index < 2) return; // Skip first two panels
    const rect = p.getBoundingClientRect();
    const midpoint = rect.top + rect.height / 2;
    if (currentY < midpoint && index < targetIndex) targetIndex = index;
    if (currentY > midpoint && index > targetIndex) targetIndex = index;
  });

  if (targetIndex !== dragState.startIndex) {
    const newOrder = [...panels]
      .map(p => p.getAttribute('data-panel-name'))
      .filter((name): name is string => !!name);
    
    const [moved] = newOrder.splice(dragState.startIndex, 1);
    newOrder.splice(targetIndex, 0, moved);
    updatePanelOrder(newOrder);
  }

  // Reset panel styles
  panel.style.transform = '';
  panel.style.zIndex = '';
  panel.style.opacity = '';
};