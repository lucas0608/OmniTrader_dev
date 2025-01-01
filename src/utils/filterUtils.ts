// Utility functions for filter operations
export const isValidMove = (
  fromIndex: number,
  toIndex: number,
  items: any[],
  blockedIndex: number
) => {
  // First item can only move down
  if (fromIndex === 2 && toIndex < 2) return false;
  
  // Last draggable item can only move up
  const lastDraggableIndex = blockedIndex - 1;
  if (fromIndex === lastDraggableIndex && toIndex >= lastDraggableIndex) return false;

  // Don't allow moving beyond blocked items or locked items
  if (toIndex >= blockedIndex || toIndex < 2) return false;

  return true;
};

export const getBlockedIndex = (items: any[]) => {
  return items.findIndex(item => item.blocked);
};