'use client';
// TODO M2: drag the top/bottom edge of a timed event to resize. Returns the
// resize-handle ref and bound handlers.

export function useResize() {
  // TODO M2: capture pointer on edge handle, recompute end (or start) instant.
  return {
    enabled: false as const,
  };
}
