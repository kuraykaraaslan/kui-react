'use client';
import { useCallback, useState } from 'react';
import type { TimeUnit } from '../types';

const ORDER: TimeUnit[] = ['day', 'week', 'month', 'quarter', 'year'];

/**
 * Manage the active scale level + zoom-in/zoom-out helpers. The scale value
 * is fully controllable via `defaultScale`; `setScale` can be called from
 * the toolbar dropdown or keyboard shortcuts (TODO M6: +/- bindings).
 */
export function useZoom(defaultScale: TimeUnit = 'week') {
  const [scale, setScale] = useState<TimeUnit>(defaultScale);

  const zoomIn = useCallback(() => {
    setScale((prev) => {
      const i = ORDER.indexOf(prev);
      return ORDER[Math.max(0, i - 1)] ?? prev;
    });
  }, []);

  const zoomOut = useCallback(() => {
    setScale((prev) => {
      const i = ORDER.indexOf(prev);
      return ORDER[Math.min(ORDER.length - 1, i + 1)] ?? prev;
    });
  }, []);

  return { scale, setScale, zoomIn, zoomOut };
}
