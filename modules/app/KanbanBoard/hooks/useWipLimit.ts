'use client';
// TODO M2: WIP limit validation + over-limit visual state.
// API sketch:
//   const { isOverLimit, badgeText } = useWipLimit({ column, count });
//   // -> badgeText e.g. "3/5", isOverLimit -> tint header red.
export function useWipLimit() {
  // TODO M2: compute current count vs column.wipLimit, expose for ColumnHeader.
  return {};
}
