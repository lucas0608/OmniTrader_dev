interface DragTarget {
  targetPanel: HTMLElement;
  direction: number;
  affectedPanels: HTMLElement[];
}

export const calculateDragTarget = (
  draggedPanel: HTMLElement,
  deltaY: number
): DragTarget | null => {
  const panels = Array.from(document.querySelectorAll('.panel-container'));
  const currentIndex = panels.indexOf(draggedPanel);
  const panelHeight = draggedPanel.getBoundingClientRect().height;
  const threshold = panelHeight / 2;

  // Don't allow dragging beyond bounds
  if (currentIndex < 2) return null; // First two panels are locked

  // Calculate direction and target index
  const direction = deltaY > 0 ? 1 : -1;
  const targetIndex = currentIndex + direction;

  // Check if target index is valid
  if (targetIndex >= 2 && targetIndex < panels.length) { // Start from index 2
    const targetPanel = panels[targetIndex] as HTMLElement;
    const affectedPanels: HTMLElement[] = [];

    // Calculate affected panels based on drag direction
    if (Math.abs(deltaY) > threshold) {
      if (direction > 0) { // Dragging down
        // Panels between current and target should move up
        for (let i = currentIndex + 1; i <= targetIndex; i++) {
          affectedPanels.push(panels[i] as HTMLElement);
        }
      } else { // Dragging up
        // Panels between target and current should move down
        for (let i = targetIndex; i < currentIndex; i++) {
          affectedPanels.push(panels[i] as HTMLElement);
        }
      }

      return {
        targetPanel,
        direction,
        affectedPanels
      };
    }
  }

  return null;
};