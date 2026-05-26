'use client';
// TODO M2: localStorage-backed recent-commands queue.
// Stub kept so the public API is forward-compatible.

import type { CommandItem } from '../types';

export function useRecent(_limit = 5): {
  recent: CommandItem[];
  push: (cmd: CommandItem) => void;
  clear: () => void;
} {
  // TODO M2: read/write `localStorage['cmdbar:recent']`.
  return {
    recent: [],
    push: () => {},
    clear: () => {},
  };
}
