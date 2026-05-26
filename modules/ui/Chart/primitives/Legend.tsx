'use client';
// modules/ui/Chart/primitives/Legend.tsx
//
// Series legend strip rendered below the chart. Token-aware swatches.
// M4 will add click-to-toggle and active state styling; for now this is
// a presentation-only list.

import { cn } from '@/libs/utils/cn';
import { chartTheme } from '../theme';
import type { Series } from '../types';
import { paletteColor } from '../theme';

type LegendProps = {
  series: Series[];
  className?: string;
};

export function Legend({ series, className }: LegendProps) {
  if (!series.length) return null;
  return (
    <ul
      className={cn('mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5', className)}
      style={{ fontSize: chartTheme.fontSize.legend }}
      role="list"
    >
      {series.map((s, i) => {
        const color = paletteColor(i, s.color);
        return (
          <li key={s.id} className="flex items-center gap-2 text-text-secondary">
            <span
              aria-hidden="true"
              className="inline-block size-2.5 rounded-sm"
              style={{
                backgroundColor: color,
                border: `1px solid ${chartTheme.legendSwatchBorder}`,
              }}
            />
            <span>{s.name}</span>
          </li>
        );
      })}
    </ul>
  );
}
