'use client';
// modules/ui/Chart/primitives/ResponsiveContainer.tsx
//
// ResizeObserver-backed sizing wrapper. Reports the measured pixel size
// to the child render-prop so charts can compute scales against the
// actual container width without forcing layout on every render.

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/libs/utils/cn';

type ResponsiveContainerProps = {
  /** Fixed height in pixels — width tracks the parent. Default = 240. */
  height?: number;
  className?: string;
  children: (size: { width: number; height: number }) => React.ReactNode;
};

export function ResponsiveContainer({
  height = 240,
  className,
  children,
}: ResponsiveContainerProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 0;
      setWidth(Math.max(0, Math.floor(w)));
    });
    ro.observe(el);
    // Prime with the current width to avoid a flash of zero-sized chart.
    setWidth(Math.floor(el.getBoundingClientRect().width));
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn('relative w-full', className)}
      style={{ height }}
    >
      {width > 0 && children({ width, height })}
    </div>
  );
}
