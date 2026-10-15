'use client';
// modules/ui/Chart/primitives/Legend.tsx
//
// Series legend strip. Token-aware 8px dots, 12px text. Presentation-only by default; with
// `onToggle` every entry is a button (aria-pressed) that shows or hides its series. `values`
// prints a ready-made text (latest, min, …) after each name. `position` picks the spacing and,
// for left / right, a vertical list. `layout="grid"` lines entries up in columns (values
// right-aligned), for legends with many entries (a pie's slices).

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
  /** 'wrap' (default) flows entries in a line; 'grid' lines them up in columns. */
  layout?: 'wrap' | 'grid';
};

const SPACING: Record<LegendPosition, string> = {
  top: 'mb-2 flex-row flex-wrap gap-x-4 gap-y-1.5',
  bottom: 'mt-2 flex-row flex-wrap gap-x-4 gap-y-1.5',
  left: 'flex-col justify-center gap-2',
  right: 'flex-col justify-center gap-2',
};

export function Legend({ series, className, position = 'bottom', hiddenIds, onToggle, values, style, layout = 'wrap' }: LegendProps) {
  if (!series.length) return null;
  const side = position === 'left' || position === 'right';
  const grid = layout === 'grid' && !side;
  return (
    <ul
      className={cn(
        grid ? cn('grid gap-x-5 gap-y-1.5', position === 'top' ? 'mb-2' : 'mt-2') : cn('flex', side ? 'shrink-0' : 'items-center', SPACING[position]),
        side && 'max-w-[45%] min-w-0',
        className,
      )}
      style={{
        fontSize: chartTheme.fontSize.legend,
        lineHeight: '16px',
        ...(grid ? { gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 124px), 1fr))' } : {}),
        ...style,
      }}
      role="list"
    >
      {series.map((s, i) => {
        const color = paletteColor(i, s.color);
        const off = hiddenIds?.has(s.id) ?? false;
        const stretch = grid || side;
        const body = (
          <>
            <span
              aria-hidden="true"
              className="inline-block size-2 shrink-0 rounded-full"
              style={{
                backgroundColor: off ? 'transparent' : color,
                boxShadow: off ? `inset 0 0 0 1.5px ${color}` : undefined,
              }}
            />
            <span className={cn('min-w-0', stretch && 'truncate', off && 'line-through')}>{s.name}</span>
            {values?.[s.id] && <span className={cn('shrink-0 tabular-nums font-medium text-text-primary', stretch && 'ml-auto pl-2')}>{values[s.id]}</span>}
          </>
        );
        return (
          <li key={s.id} className={cn('flex min-w-0 items-center gap-2 text-text-secondary', off && 'opacity-60')}>
            {onToggle ? (
              <button
                type="button"
                aria-pressed={!off}
                onClick={() => onToggle(s.id)}
                className={cn(
                  'flex min-w-0 cursor-pointer items-center gap-2 rounded-sm text-left text-inherit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
                  stretch && 'w-full',
                )}
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
