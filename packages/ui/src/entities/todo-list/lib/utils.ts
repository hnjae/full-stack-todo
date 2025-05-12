const generateUniqueName = function (
  proposedName: string,
  items: readonly { name: string }[] | null | undefined,
): string {
  if (items == null || items.length === 0) {
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

export { generateUniqueName };
