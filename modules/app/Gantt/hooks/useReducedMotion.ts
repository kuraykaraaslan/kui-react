'use client';
import { useEffect, useState } from 'react';

/**
 * Tracks `prefers-reduced-motion: reduce`. Always returns `true` when the
 * caller supplies `force = true` (lets a parent component override the OS
 * setting via the `reducedMotion` prop).
 */
export function useReducedMotion(force?: boolean): boolean {
  const [systemPrefers, setSystemPrefers] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setSystemPrefers(mq.matches);
    const onChange = () => setSystemPrefers(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return force === true ? true : systemPrefers;
}
