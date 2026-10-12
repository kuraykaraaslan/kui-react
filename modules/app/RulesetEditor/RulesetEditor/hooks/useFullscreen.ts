'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

/** classes for the element that goes fullscreen: with `data-fs="true"` it covers the page (also the fallback when the browser has no Fullscreen API) */
export const FULLSCREEN_CLASSES = 'data-[fs=true]:fixed data-[fs=true]:inset-0 data-[fs=true]:z-50 data-[fs=true]:h-screen data-[fs=true]:w-screen data-[fs=true]:bg-surface-base';

/**
 * Fullscreen for an element: the browser's Fullscreen API where it is there, a fixed overlay over the page where it
 * is not (or the browser refuses). The element is marked `data-fs="true"` while it is fullscreen; give it
 * `FULLSCREEN_CLASSES` so the mark covers the page. Esc leaves either kind.
 */
export function useFullscreen(getTarget: () => HTMLElement | null): { active: boolean; toggle: () => void } {
  const [active, setActive] = useState(false);
  const target = useRef<HTMLElement | null>(null);
  const real = useRef(false);

  const leave = useCallback(() => {
    const el = target.current;
    if (el) delete el.dataset.fs;
    target.current = null;
    setActive(false);
    if (real.current && document.fullscreenElement) void document.exitFullscreen?.().catch(() => undefined);
    real.current = false;
  }, []);

  const enter = useCallback(async () => {
    const el = getTarget();
    if (!el) return;
    target.current = el;
    el.dataset.fs = 'true';
    setActive(true);
    try {
      if (document.fullscreenEnabled && el.requestFullscreen) { await el.requestFullscreen(); real.current = true; }
    } catch { /* refused: the overlay stays */ }
  }, [getTarget]);

  const toggle = useCallback(() => { if (target.current) leave(); else void enter(); }, [enter, leave]);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && !real.current && !document.querySelector('[role="dialog"]')) leave(); };
    const onChange = () => { if (real.current && !document.fullscreenElement) leave(); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('fullscreenchange', onChange);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('fullscreenchange', onChange); };
  }, [active, leave]);

  useEffect(() => () => { if (target.current) delete target.current.dataset.fs; }, []);

  return { active, toggle };
}
