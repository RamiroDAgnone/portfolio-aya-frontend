// mueve arriba o abajo sin mutar objetos
export function moveItemByOrder(items, id, direction) {
  if (!Array.isArray(items)) return items;

  const sorted = [...items]
    .map(i => ({ ...i }))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const index = sorted.findIndex(i => i.id === id);
  if (index === -1) return items;

  const targetIndex =
    direction === "up" ? index - 1 : index + 1;

  if (targetIndex < 0 || targetIndex >= sorted.length) {
    return items;
  }

  const current = sorted[index];
  const target = sorted[targetIndex];

  return sorted.map(item => {
    if (item.id === current.id)
      return { ...item, order: target.order };
    if (item.id === target.id)
      return { ...item, order: current.order };
    return item;
  });
}

// reorder por drag & drop (index visual)
export function reorderByIndex(array, from, to) {
  const copy = [...array];
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);

  return copy.map((item, index) => ({
    ...item,
    order: index * 10
  }));
}