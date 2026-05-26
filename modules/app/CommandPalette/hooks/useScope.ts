'use client';
// TODO M3: nested command scopes (e.g. "Navigation > Settings >").
// Stub kept so the public API is forward-compatible.

export function useScope(): {
  path: string[];
  enter: (label: string) => void;
  leave: () => void;
  reset: () => void;
} {
  // TODO M3: real implementation backed by useState + breadcrumb.
  return {
    path: [],
    enter: () => {},
    leave: () => {},
    reset: () => {},
  };
}
