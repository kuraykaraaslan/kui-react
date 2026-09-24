'use client';
import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(onChange: () => void) {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {};
  const mq = window.matchMedia(QUERY);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

function getSnapshot() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia(QUERY).matches;
}

const getServerSnapshot = () => false;

/**
 * Tracks `prefers-reduced-motion: reduce`. Always returns `true` when the
 * caller supplies `force = true` (lets a parent component override the OS
 * setting via the `reducedMotion` prop).
 */
export function useReducedMotion(force?: boolean): boolean {
  const systemPrefers = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return force === true ? true : systemPrefers;
}
