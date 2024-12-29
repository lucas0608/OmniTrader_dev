interface DragPosition {
  centerY: number;
  rect: DOMRect;
}

export const useDragDetection = () => {
  const REORDER_THRESHOLD = 15; // Adjusted threshold for better detection

  const getDragPosition = (element: HTMLElement): DragPosition => {
    const rect = element.getBoundingClientRect();
    return {
      centerY: rect.top + rect.height / 2,
      rect
    };
  };

  const shouldReorder = (
    draggedPos: DragPosition,
    targetPos: DragPosition,
    currentIndex: number,
    targetIndex: number,
    totalPanels: number
  ): boolean => {
    // Prevent invalid reordering outside bounds
    if (targetIndex < 0 || targetIndex >= totalPanels) return false;

    // Check for overlap exceeding the threshold
    const overlap = Math.abs(draggedPos.centerY - targetPos.centerY);
    if (overlap < REORDER_THRESHOLD) return false;

    // Allow dynamic reordering based on direction
    if (currentIndex < targetIndex) {
      return draggedPos.centerY > targetPos.rect.top;
    }
    return draggedPos.centerY < targetPos.rect.bottom;
  };

  return {
    getDragPosition,
    shouldReorder
  };
};
