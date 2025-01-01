interface AffectedPanel {
  panel: HTMLElement;
  direction: number; // 1 for up, -1 for down
}

export const calculateDragPosition = (
  draggedPanel: HTMLElement,
  deltaY: number
): { affectedPanels: AffectedPanel[] } => {
  const panels = Array.from(document.querySelectorAll('.panel-container'));
  const currentIndex = panels.indexOf(draggedPanel);
  const affectedPanels: AffectedPanel[] = [];

  // Get panel heights
  const panelHeight = draggedPanel.getBoundingClientRect().height;
  const threshold = panelHeight / 2;

  // Determine which panels need to move
  if (Math.abs(deltaY) > threshold) {
    const direction = deltaY > 0 ? 1 : -1;
    const targetIndex = currentIndex + direction;

    // Check if target index is valid
    if (targetIndex >= 0 && targetIndex < panels.length) {
      const targetPanel = panels[targetIndex] as HTMLElement;
      affectedPanels.push({
        panel: targetPanel,
        direction: -direction // Opposite direction of drag
      });
    }
  }

  return { affectedPanels };
};