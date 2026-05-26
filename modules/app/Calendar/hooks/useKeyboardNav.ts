'use client';
import { useEffect, type RefObject } from 'react';

type Options = {
  rootRef: RefObject<HTMLElement | null>;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  enabled?: boolean;
};

/**
 * Keyboard navigation for the calendar root.
 *
 * - Page Up   → previous period
 * - Page Down → next period
 * - T         → jump to today
 *
 * Focus must be inside `rootRef` (or the calendar must be focused) for the
 * shortcuts to fire — keeps the calendar from hijacking global keys.
 */
export function useKeyboardNav({ rootRef, onPrev, onNext, onToday, enabled = true }: Options) {
  useEffect(() => {
    if (!enabled) return;
    const root = rootRef.current;
    if (!root) return;

    function onKey(e: KeyboardEvent) {
      // Ignore when user is typing into an input / textarea / contenteditable
      const target = e.target as HTMLElement | null;
      if (
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable
      ) {
        return;
      }

      if (e.key === 'PageUp') {
        e.preventDefault();
        onPrev();
      } else if (e.key === 'PageDown') {
        e.preventDefault();
        onNext();
      } else if (e.key === 't' || e.key === 'T') {
        // Don't interfere if a modifier is held (e.g. Ctrl-T new tab).
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        e.preventDefault();
        onToday();
      }
    }

    root.addEventListener('keydown', onKey);
    return () => root.removeEventListener('keydown', onKey);
  }, [rootRef, onPrev, onNext, onToday, enabled]);
}
