'use client';
// modules/ui/Chart/primitives/Legend.tsx
//
// Series legend strip. Token-aware swatches. Presentation-only by default; with `onToggle`
// every entry is a button (aria-pressed) that shows or hides its series. `values` prints a
// ready-made text (latest, min, …) after each name. `position` picks the spacing and, for
// left / right, a vertical list.

import type { CSSProperties } from 'react';
import { cn } from '@/libs/utils/cn';
import { chartTheme } from '../theme';
import type { LegendPosition, Series } from '../types';
import { paletteColor } from '../theme';

type LegendProps = {
  series: Series[];
  className?: string;
  /** Where the legend sits; decides spacing and direction. Default = 'bottom'. */
  position?: LegendPosition;
  /** Ids currently hidden (drawn dimmed, `aria-pressed="false"`). */
  hiddenIds?: ReadonlySet<string>;
  /** Makes the entries toggle buttons. */
  onToggle?: (id: string) => void;
  /** Extra text per series id, printed after the name. */
  values?: Record<string, string | undefined>;
  /** Inline style for the legend text. */
  style?: CSSProperties;
};

const SPACING: Record<LegendPosition, string> = {
  top: 'mb-3 flex-row flex-wrap gap-x-4 gap-y-1.5',
  bottom: 'mt-3 flex-row flex-wrap gap-x-4 gap-y-1.5',
  left: 'mr-1 flex-col gap-1.5',
  right: 'ml-1 flex-col gap-1.5',
};

export function Legend({ series, className, position = 'bottom', hiddenIds, onToggle, values, style }: LegendProps) {
  if (!series.length) return null;
  return (
    <ul
      className={cn('flex', position === 'top' || position === 'bottom' ? 'items-center' : 'shrink-0 items-start', SPACING[position], className)}
      style={{ fontSize: chartTheme.fontSize.legend, ...style }}
      role="list"
    >
      {series.map((s, i) => {
        const color = paletteColor(i, s.color);
        const off = hiddenIds?.has(s.id) ?? false;
        const body = (
          <>
            <span
              aria-hidden="true"
              className="inline-block size-2.5 shrink-0 rounded-sm"
              style={{
                backgroundColor: off ? 'transparent' : color,
                border: `1px solid ${off ? color : chartTheme.legendSwatchBorder}`,
              }}
            />
            <span className={cn(off && 'line-through')}>{s.name}</span>
            {values?.[s.id] && <span className="tabular-nums text-text-primary">{values[s.id]}</span>}
          </>
        );
        return (
          <li key={s.id} className={cn('flex items-center gap-2 text-text-secondary', off && 'opacity-60')}>
            {onToggle ? (
              <button
                type="button"
                aria-pressed={!off}
                onClick={() => onToggle(s.id)}
                className="flex cursor-pointer items-center gap-2 rounded-sm text-inherit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
              >
                {body}
              </button>
            ) : body}
          </li>
        );
      })}
    </ul>
  );
}
