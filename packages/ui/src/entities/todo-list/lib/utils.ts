const TODOLIST_ORDER_SPACING = 65536; // 2^16

const generateUniqueName = function (
  proposedName: string,
  items: readonly { name: string }[],
): string {
  if (items.length === 0) {
    return proposedName;
  }

  const names = new Set(items.map((item) => item.name));

  if (!names.has(proposedName)) {
    return proposedName;
  }

  let idx = 1;
  let potentialName = `${proposedName} (${idx})`;
  while (names.has(potentialName)) {
    idx += 1;
    potentialName = `${proposedName} (${idx})`;
  }

  return potentialName;
};

const balanceItems = function <T extends { order: number }>(
  sortedItems: readonly T[],
): T[] {
  if (sortedItems.length === 0) {
    return [];
  }

  const newOrderMin =
    -Math.floor(sortedItems.length / 2) * TODOLIST_ORDER_SPACING;

  return sortedItems.map((item, idx) => {
    return { ...item, order: newOrderMin + TODOLIST_ORDER_SPACING * idx };
  });
};

export { balanceItems, generateUniqueName, TODOLIST_ORDER_SPACING };
