'use client';
import { useEffect, type RefObject } from 'react';

type Options = {
  containerRef: RefObject<HTMLDivElement | null>;
  videoRef: RefObject<HTMLVideoElement | null>;
  togglePlay: () => void;
  seekBy: (delta: number) => void;
  toggleMute: () => void;
  handleVolumeChange: (val: number) => void;
  toggleFullscreen: () => void;
  volume: number;
  showSettings: boolean;
  closeSettings: () => void;
};

export function useKeyboardShortcuts({
  containerRef,
  videoRef,
  togglePlay,
  seekBy,
  toggleMute,
  handleVolumeChange,
  toggleFullscreen,
  volume,
  showSettings,
  closeSettings,
}: Options) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const c = containerRef.current;
      if (!c) return;
      const focused = document.activeElement;
      if (!c.contains(focused) && focused !== c) return;
      const v = videoRef.current;
      if (!v) return;
      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          seekBy(-10);
          break;
        case 'ArrowRight':
          e.preventDefault();
          seekBy(10);
          break;
        case 'ArrowUp':
          e.preventDefault();
          handleVolumeChange(volume + 0.1);
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleVolumeChange(volume - 0.1);
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'Escape':
          if (showSettings) {
            e.preventDefault();
            closeSettings();
          }
          break;
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [
    containerRef,
    videoRef,
    togglePlay,
    seekBy,
    toggleMute,
    handleVolumeChange,
    toggleFullscreen,
    volume,
    showSettings,
    closeSettings,
  ]);
}
