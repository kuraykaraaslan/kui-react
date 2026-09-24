'use client';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

const subscribeNoop = () => () => {};
const lacksIntersectionObserver = () => typeof IntersectionObserver === 'undefined';
const serverHasObserver = () => false;

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
  const [intersected, setIntersected] = useState(false);
  // Very old browser fallback: no IntersectionObserver → render immediately.
  const noObserver = useSyncExternalStore(subscribeNoop, lacksIntersectionObserver, serverHasObserver);
  const visible = intersected || noObserver;

  useEffect(() => {
    if (visible) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIntersected(true);
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
