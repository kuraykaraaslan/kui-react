'use client';
// modules/ui/Chart/primitives/Tooltip.tsx
//
// Floating hover tooltip rendered as an HTML overlay (not SVG) so it can
// escape clipping and use the standard text tokens. The parent chart
// supplies absolute x/y in container coordinates.

import { cn } from '@/libs/utils/cn';
import { chartTheme } from '../theme';
import type { TooltipDatum } from '../types';

type TooltipProps = {
  /** Title shown at the top of the tooltip (typically the x value). */
  label: string;
  /** Rows — one per visible series. */
  data: TooltipDatum[];
  /** Pixel x in container coordinates of the anchor point. */
  x: number;
  /** Pixel y in container coordinates of the anchor point. */
  y: number;
  /** Container width — used to flip the tooltip if it would overflow. */
  containerWidth: number;
  visible: boolean;
  className?: string;
};

export function ChartTooltip({
  label,
  data,
  x,
  y,
  containerWidth,
  visible,
  className,
}: TooltipProps) {
  if (!visible || !data.length) return null;
  // Naive overflow flip — keeps the tooltip on-screen on the right edge.
  const flip = x > containerWidth - 160;
  const left = flip ? x - 12 : x + 12;
  const transform = flip ? 'translate(-100%, -50%)' : 'translate(0, -50%)';
  return (
    <div
      className={cn(
        'pointer-events-none absolute z-10 min-w-[140px] rounded-md border px-3 py-2 shadow-md',
        className,
      )}
      role="tooltip"
      style={{
        left,
        top: y,
        transform,
        backgroundColor: chartTheme.tooltipBg,
        borderColor: chartTheme.tooltipBorder,
        color: chartTheme.tooltipText,
        fontSize: chartTheme.fontSize.tooltip,
      }}
    >
      <div className="mb-1 text-xs font-semibold">{label}</div>
      <ul className="space-y-0.5">
        {data.map((d) => (
          <li key={d.seriesId} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="inline-block size-2 rounded-sm"
              style={{ backgroundColor: d.color }}
            />
            <span style={{ color: chartTheme.tooltipMutedText }}>{d.seriesName}</span>
            <span className="ml-auto font-medium tabular-nums">
              {d.y === null ? '—' : d.y}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
