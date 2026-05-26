'use client';
// TODO M2: drag an empty calendar cell → preview + create a new event with
// live start/end labels and snap-to-interval. Returns the pointer handlers
// that the views attach to their grid cells.

export function useDragCreate() {
  // TODO M2: capture pointerdown / pointermove / pointerup on the grid,
  // compute snapped start + end, render a ghost event, fire onEventCreate.
  return {
    enabled: false as const,
  };
}
