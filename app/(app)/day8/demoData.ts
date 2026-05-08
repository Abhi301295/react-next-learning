/** Small in-memory dataset for Day 8 demos (useMemo / list rendering). */
export const DAY8_ALL_USERS = [
  "john",
  "jane",
  "doe",
  "jill",
  "jack",
  "simon",
] as const;

export type Day8MemoItem = { id: number; isSelected: boolean };

export const DAY8_MEMO_ITEMS: Day8MemoItem[] = Array.from(
  { length: 12 },
  (_, index) => ({
    id: index,
    isSelected: index === 11,
  })
);
