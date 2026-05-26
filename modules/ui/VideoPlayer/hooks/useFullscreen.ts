'use client';
import { useCallback, type RefObject } from 'react';

export function useFullscreen(containerRef: RefObject<HTMLDivElement | null>) {
  const toggleFullscreen = useCallback(() => {
    const c = containerRef.current;
    if (!c) return;
    if (!document.fullscreenElement) c.requestFullscreen();
    else document.exitFullscreen();
  }, [containerRef]);

  return { toggleFullscreen };
}
