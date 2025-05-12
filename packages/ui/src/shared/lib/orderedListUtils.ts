const ORDER_SPACING = 65536; // 2^16

const balanceItems = function <T extends { order: number }>(
  sortedItems: readonly T[],
): T[] {
  if (sortedItems.length === 0) {
    return [];
  }

  const newOrderMin = -Math.floor(sortedItems.length / 2) * ORDER_SPACING;

  return sortedItems.map((item, idx) => {
    return { ...item, order: newOrderMin + ORDER_SPACING * idx };
  });
};

export { balanceItems, ORDER_SPACING };
