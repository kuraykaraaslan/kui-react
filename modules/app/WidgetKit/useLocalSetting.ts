'use client';
import { useCallback, useSyncExternalStore } from 'react';

const EVENT = 'kui:local-setting';

function subscribe(cb: () => void) {
  window.addEventListener('storage', cb);
  window.addEventListener(EVENT, cb);
  return () => { window.removeEventListener('storage', cb); window.removeEventListener(EVENT, cb); };
}

/**
 * A per-viewer convenience kept in localStorage (a remembered mode, a demo board). Reads go through
 * useSyncExternalStore, so the server render and the first client render agree (`null`), and every
 * component using the same key updates together. Blocked storage behaves as an empty one.
 */
export function useLocalSetting(key: string): [string | null, (value: string | null) => void] {
  const read = useCallback(() => {
    try { return window.localStorage.getItem(key); } catch { return null; }
  }, [key]);
  const value = useSyncExternalStore(subscribe, read, () => null);
  const write = useCallback((next: string | null) => {
    try {
      if (next === null) window.localStorage.removeItem(key);
      else window.localStorage.setItem(key, next);
    } catch { /* storage full or blocked */ }
    window.dispatchEvent(new Event(EVENT));
  }, [key]);
  return [value, write];
}
