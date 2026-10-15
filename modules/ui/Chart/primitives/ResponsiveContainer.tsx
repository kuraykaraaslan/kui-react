'use client';
// modules/ui/Chart/primitives/ResponsiveContainer.tsx
//
// ResizeObserver-backed sizing wrapper. Reports the measured pixel size
// to the child render-prop so charts can compute scales against the
// actual container width without forcing layout on every render.
// With `fill` it also measures its height (it takes 100% of a parent with a definite height).

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/libs/utils/cn';

type ResponsiveContainerProps = {
  /** Fixed height in pixels — width tracks the parent. Default = 240. With `fill`, the fallback before the first measure. */
  height?: number;
  /** Take the parent's height. */
  fill?: boolean;
  className?: string;
  children: (size: { width: number; height: number }) => React.ReactNode;
};

export function ResponsiveContainer({
  height = 240,
  fill = false,
  className,
  children,
}: ResponsiveContainerProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const read = (w: number, h: number) => setSize((prev) => {
      const next = { width: Math.max(0, Math.floor(w)), height: Math.max(0, Math.floor(h)) };
      return prev.width === next.width && prev.height === next.height ? prev : next;
    });
    // Prime with the current size to avoid a flash of zero-sized chart.
    const box = el.getBoundingClientRect();
    read(box.width, box.height);
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver((entries) => {
      const r = entries[0]?.contentRect;
      if (r) read(r.width, r.height);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const h = fill ? (size.height > 0 ? size.height : height) : height;
  return (
    <div
      ref={ref}
      className={cn('relative w-full', fill && 'h-full min-h-0', className)}
      style={fill ? { minHeight: 80 } : { height }}
    >
      {size.width > 0 && children({ width: size.width, height: h })}
    </div>
  );
}
