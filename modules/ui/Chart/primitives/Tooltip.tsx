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
  /** A last row under a divider, e.g. a stack's total. */
  footer?: { label: string; value: string };
};

export function ChartTooltip({
  label,
  data,
  x,
  y,
  containerWidth,
  visible,
  className,
  footer,
}: TooltipProps) {
  if (!visible || !data.length) return null;
  // Naive overflow flip — keeps the tooltip on-screen on the right edge.
  const flip = x > containerWidth - 160;
  const left = flip ? x - 12 : x + 12;
  const transform = flip ? 'translate(-100%, -50%)' : 'translate(0, -50%)';
  return (
    <div
      className={cn(
        'pointer-events-none absolute z-10 min-w-[140px] max-w-[260px] rounded-lg border px-3 py-2 shadow-md',
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
      {label && <div className="mb-1.5 text-[11px] font-medium" style={{ color: chartTheme.tooltipMutedText }}>{label}</div>}
      <ul className="space-y-1">
        {data.map((d) => (
          <li key={d.seriesId} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="inline-block size-2 shrink-0 rounded-full"
              style={{ backgroundColor: d.color }}
            />
            <span className="min-w-0 truncate" style={{ color: chartTheme.tooltipMutedText }}>{d.seriesName}</span>
            <span className="ml-auto pl-3 font-semibold tabular-nums">
              {d.valueLabel ?? (d.y === null ? '—' : d.y)}
            </span>
          </li>
        ))}
      </ul>
      {footer && (
        <div className="mt-1.5 flex items-center gap-2 border-t pt-1.5" style={{ borderColor: chartTheme.tooltipBorder }} data-tooltip-total="">
          <span style={{ color: chartTheme.tooltipMutedText }}>{footer.label}</span>
          <span className="ml-auto pl-3 font-semibold tabular-nums">{footer.value}</span>
        </div>
      )}
    </div>
  );
}
