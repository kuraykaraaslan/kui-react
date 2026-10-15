'use client';
// modules/ui/Chart/primitives/ChartFrame.tsx
//
// Places a chart's legend above, below, left or right of the plot. The plot side takes the
// remaining width (`min-w-0 flex-1`) so the ResponsiveContainer inside measures correctly.

import type { ReactNode } from 'react';
import { cn } from '@/libs/utils/cn';
import type { LegendPosition } from '../types';

type ChartFrameProps = {
  legend?: ReactNode;
  position?: LegendPosition;
  className?: string;
  children: ReactNode;
};

export function ChartFrame({ legend, position = 'bottom', className, children }: ChartFrameProps) {
  if (!legend) return <div className={cn('w-full', className)}>{children}</div>;
  const side = position === 'left' || position === 'right';
  return (
    <div className={cn('flex w-full', side ? 'flex-row items-center gap-3' : 'flex-col', className)}>
      {(position === 'top' || position === 'left') && legend}
      <div className="min-w-0 flex-1">{children}</div>
      {(position === 'bottom' || position === 'right') && legend}
    </div>
  );
}
