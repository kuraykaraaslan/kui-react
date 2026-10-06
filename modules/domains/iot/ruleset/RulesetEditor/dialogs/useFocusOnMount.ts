'use client';
import { useEffect, useRef } from 'react';

/** A ref for the field a dialog should start in. The modal moves focus to its own first control when it opens, so this waits a moment. */
export function useFocusOnMount<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const timer = window.setTimeout(() => ref.current?.focus(), 60);
    return () => window.clearTimeout(timer);
  }, []);
  return ref;
}
