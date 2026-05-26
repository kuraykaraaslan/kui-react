// modules/ui/Slider/hooks/useAutoPlay.ts
//
// Interval-based autoplay. Lifted from the original Slider.tsx unchanged
// so existing consumers keep working byte-for-byte.
//
// TODO M3: pause-on-hover, pause-on-focus-within, pause-on-visibility-change,
//          autoPlayDirection (forward/backward), progress callback.

import { useEffect, useRef } from 'react';

type UseAutoPlayArgs = {
  enabled: boolean;
  interval: number;
  total: number;
  onTick: () => void;
};

export function useAutoPlay({ enabled, interval, total, onTick }: UseAutoPlayArgs) {
  const onTickRef = useRef(onTick);
  // Keep the latest callback without re-creating the interval on every render.
  useEffect(() => {
    onTickRef.current = onTick;
  }, [onTick]);

  useEffect(() => {
    if (!enabled || total <= 1) return;
    const id = setInterval(() => onTickRef.current(), interval);
    return () => clearInterval(id);
  }, [enabled, interval, total]);
}
