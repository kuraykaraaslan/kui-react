'use client';
// Global ⌘K / Ctrl-K open + Esc close (M1).
// TODO M4: full shortcut registry with conflict detection + training.

import { useEffect } from 'react';

type Opts = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export function useShortcuts({ isOpen, onOpen, onClose }: Opts): void {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      // ⌘K / Ctrl-K toggles the palette.
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onOpen();
        return;
      }
      // Esc closes when open (Modal also handles this, but we keep parity with EJS).
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onOpen, onClose]);
}
