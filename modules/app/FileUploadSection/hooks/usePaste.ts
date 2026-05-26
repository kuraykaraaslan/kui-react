'use client';
// modules/app/FileUploadSection/hooks/usePaste.ts
//
// Listens for `paste` events on `document` and extracts any file-typed
// clipboard items (typically images). Only invokes the callback when the
// paste happens while focus is inside the supplied root container, so we
// don't hijack page-wide pastes.
//
// M1 — paste from clipboard.

import { useEffect } from 'react';

export function usePaste(
  rootRef: React.RefObject<HTMLElement | null>,
  enabled: boolean,
  onFiles: (files: File[]) => void
) {
  useEffect(() => {
    if (!enabled) return;
    const handler = (ev: ClipboardEvent) => {
      const root = rootRef.current;
      if (!root) return;
      const active = document.activeElement;
      const inside = active && (root === active || root.contains(active));
      if (!inside) return;

      const items = ev.clipboardData?.items;
      if (!items || items.length === 0) return;
      const out: File[] = [];
      for (let i = 0; i < items.length; i++) {
        const it = items[i];
        if (it.kind === 'file') {
          const f = it.getAsFile();
          if (f) {
            const named =
              f.name && f.name !== 'image.png'
                ? f
                : new File(
                    [f],
                    `pasted-${Date.now()}.${(f.type.split('/')[1] || 'bin').replace('+xml', '')}`,
                    { type: f.type, lastModified: Date.now() }
                  );
            out.push(named);
          }
        }
      }
      if (out.length > 0) {
        ev.preventDefault();
        onFiles(out);
      }
    };
    document.addEventListener('paste', handler);
    return () => document.removeEventListener('paste', handler);
  }, [enabled, rootRef, onFiles]);
}
