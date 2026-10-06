'use client';
// Token-aware matrix heatmap (phase 9 §9.4). SVG, theme tokens, shared Tooltip.
// Colour is the `--primary` token at a variable opacity, so light/dark follow the theme and
// no colour scale is hard-coded.

import { useMemo, useState } from 'react';
import { cn } from '@/libs/utils/cn';
import { ResponsiveContainer } from '../primitives/ResponsiveContainer';
import { ChartTooltip } from '../primitives/Tooltip';
import { chartTheme } from '../theme';
import type { TooltipDatum } from '../types';
import { buildHeatGrid, heatIntensity, type HeatCell } from './_heatmap';

export type HeatmapChartProps = {
  cells: HeatCell[];
  height?: number;
  /** Fixed colour domain; default = the data's own min / max. */
  min?: number;
  max?: number;
  /** Tooltip / legend value text. */
  valueFormat?: (v: number) => string;
  /** Series name shown in the tooltip row. Default = "Value". */
  valueLabel?: string;
  showLegend?: boolean;
  showTooltip?: boolean;
  ariaLabel?: string;
  className?: string;
  /** Token used for the fill. Default = `var(--primary)`. */
  color?: string;
};

const PAD = { top: 8, right: 8, bottom: 26, left: 56 };

export function HeatmapChart({
  cells, height = 240, min, max, valueFormat, valueLabel = 'Value', showLegend = true, showTooltip = true,
  ariaLabel, className, color = 'var(--primary)',
}: HeatmapChartProps) {
  const [hover, setHover] = useState<{ xi: number; yi: number } | null>(null);
  const grid = useMemo(() => buildHeatGrid(cells), [cells]);
  const lo = min ?? grid.min;
  const hi = max ?? grid.max;
  const fmt = valueFormat ?? ((v: number) => String(Math.round(v * 100) / 100));

  return (
    <div className={cn('w-full', className)}>
      <ResponsiveContainer height={height}>
        {({ width }) => {
          const plotW = Math.max(0, width - PAD.left - PAD.right);
          const plotH = Math.max(0, height - PAD.top - PAD.bottom);
          const cw = grid.xs.length ? plotW / grid.xs.length : 0;
          const ch = grid.ys.length ? plotH / grid.ys.length : 0;
          const xEvery = Math.max(1, Math.ceil(56 / Math.max(1, cw)));
          const yEvery = Math.max(1, Math.ceil(14 / Math.max(1, ch)));
          const hv = hover ? grid.values[hover.yi]?.[hover.xi] ?? null : null;
          const tip: TooltipDatum[] = hover && hv !== null
            ? [{ seriesId: 'v', seriesName: valueLabel, color, x: grid.xs[hover.xi], y: hv, valueLabel: fmt(hv) }]
            : [];
          return (
            <>
              <svg width={width} height={height} role="img" aria-label={ariaLabel ?? 'Heatmap'} onMouseLeave={() => setHover(null)}>
                {grid.ys.map((label, j) => j % yEvery === 0 && (
                  <text key={`y${j}`} x={PAD.left - 6} y={PAD.top + ch * (j + 0.5) + 4} textAnchor="end"
                    fontSize={chartTheme.fontSize.axis} fill={chartTheme.axisText}>{label}</text>
                ))}
                {grid.xs.map((label, i) => i % xEvery === 0 && (
                  <text key={`x${i}`} x={PAD.left + cw * (i + 0.5)} y={height - 8} textAnchor="middle"
                    fontSize={chartTheme.fontSize.axis} fill={chartTheme.axisText}>{label}</text>
                ))}
                {grid.values.map((row, j) => row.map((v, i) => v === null ? null : (
                  <rect
                    key={`${i}:${j}`}
                    x={PAD.left + cw * i + 0.5} y={PAD.top + ch * j + 0.5}
                    width={Math.max(0, cw - 1)} height={Math.max(0, ch - 1)} rx={2}
                    fill={color} fillOpacity={0.08 + 0.92 * heatIntensity(v, lo, hi)}
                    stroke={hover?.xi === i && hover?.yi === j ? chartTheme.crosshair : 'none'} strokeWidth={1.5}
                    onMouseEnter={() => showTooltip && setHover({ xi: i, yi: j })}
                  />
                )))}
              </svg>
              {showTooltip && hover && hv !== null && (
                <ChartTooltip
                  label={`${grid.ys[hover.yi]} · ${grid.xs[hover.xi]}`}
                  data={tip}
                  x={PAD.left + cw * (hover.xi + 0.5)}
                  y={PAD.top + ch * (hover.yi + 0.5)}
                  containerWidth={width}
                  visible
                />
              )}
            </>
          );
        }}
      </ResponsiveContainer>
      {showLegend && (
        <div className="mt-2 flex items-center gap-2 text-xs text-text-secondary" aria-hidden="true">
          <span className="tabular-nums">{fmt(lo)}</span>
          <span className="h-2 flex-1 rounded-full" style={{ background: `linear-gradient(to right, color-mix(in srgb, ${color} 8%, transparent), ${color})` }} />
          <span className="tabular-nums">{fmt(hi)}</span>
        </div>
      )}
    </div>
  );
}
