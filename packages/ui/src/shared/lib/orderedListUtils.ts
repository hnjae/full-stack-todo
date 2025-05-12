import { MAX_INTEGER } from '../config';

const ORDER_SPACING = 65536; // 2^16

interface OrderedItem {
  order: number;
}

const balanceItems = function <T extends OrderedItem>(
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

const getNextOrderAndBalancedItems = function <T extends OrderedItem>(
  items: readonly T[] | null | undefined,
): { balancedItems: T[] | null; order: number } {
  let order = 0;

  if (items == null || items.length === 0) {
    return { balancedItems: null, order };
  }

  const lastOrder = items[items.length - 1].order;

  if (lastOrder > MAX_INTEGER - ORDER_SPACING) {
    const balancedItems = balanceItems(items);
    order = balancedItems[balancedItems.length - 1].order;

    return { balancedItems, order };
  }

  order = lastOrder + ORDER_SPACING;
  return { balancedItems: null, order };
};

export { balanceItems, getNextOrderAndBalancedItems, ORDER_SPACING };
