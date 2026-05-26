'use client';
import { useEffect, useState } from 'react';

/**
 * Tracks the `.dark` class on `<html>` so map providers can swap tile layers
 * without a full remount. Matches the convention used elsewhere in the
 * design system (see `.dark { }` block in app/globals.css).
 */
export function useDarkMode(): boolean {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const read = () => setIsDark(root.classList.contains('dark'));
    read();
    const mo = new MutationObserver(read);
    mo.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => mo.disconnect();
  }, []);

  return isDark;
}
