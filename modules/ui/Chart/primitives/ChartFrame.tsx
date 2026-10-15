'use client';
// modules/ui/Chart/primitives/ChartFrame.tsx
//
// Places a chart's legend above, below, left or right of the plot. The plot side takes the
// remaining width (`min-w-0 flex-1`) so the ResponsiveContainer inside measures correctly.
// With `fill` the frame takes its parent's height and the plot takes what the legend leaves.

import type { ReactNode } from 'react';
import { cn } from '@/libs/utils/cn';
import type { LegendPosition } from '../types';

type ChartFrameProps = {
  legend?: ReactNode;
  position?: LegendPosition;
  className?: string;
  /** Take the parent's height; the plot gets what the legend leaves. */
  fill?: boolean;
  children: ReactNode;
};

export function ChartFrame({ legend, position = 'bottom', className, fill, children }: ChartFrameProps) {
  if (!legend) {
    return <div className={cn('w-full', fill && 'flex h-full min-h-0 flex-col', className)}>{fill ? <div className="min-h-0 flex-1">{children}</div> : children}</div>;
  }
  const side = position === 'left' || position === 'right';
  return (
    <div className={cn('flex w-full', side ? 'flex-row gap-4' : 'flex-col', side ? (fill ? 'items-stretch' : 'items-center') : '', fill && 'h-full min-h-0', className)}>
      {(position === 'top' || position === 'left') && legend}
      <div className={cn('min-w-0 flex-1', fill && 'min-h-0')}>{children}</div>
      {(position === 'bottom' || position === 'right') && legend}
    </div>
  );
}
