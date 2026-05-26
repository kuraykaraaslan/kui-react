'use client';
import { useEffect, useRef, useState } from 'react';

/**
 * Returns `true` once the referenced element has entered the viewport at least
 * once. Used by MapView to lazy-load the map provider only when needed.
 *
 * The hook deliberately latches `true` (it does not flip back to `false` when
 * the element scrolls off) so heavy provider scripts stay resident instead of
 * tearing themselves down on every scroll.
 */
export function useInViewport<T extends Element = HTMLDivElement>(
  options?: IntersectionObserverInit,
) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) return;
    const el = ref.current;
    if (!el) return;
    // SSR + very old browser fallback: render immediately.
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: '200px', threshold: 0.01, ...options },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [visible, options]);

  return { ref, visible } as const;
}
