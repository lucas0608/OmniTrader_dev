export const reorderPanels = (
  panels: Element[],
  startIndex: number,
  targetIndex: number,
  direction: number
): string[] => {
  const newOrder = panels.map(panel => 
    panel.getAttribute('data-panel-name')
  ).filter(Boolean) as string[];

  // Don't reorder if indices are invalid
  if (startIndex < 2 || targetIndex < 2 || 
      startIndex >= panels.length || targetIndex >= panels.length) {
    return newOrder;
  }

  // Remove panel from start position and insert at target position
  const [movedPanel] = newOrder.splice(startIndex, 1);
  newOrder.splice(targetIndex, 0, movedPanel);

  return newOrder;
};