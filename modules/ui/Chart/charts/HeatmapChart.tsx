'use client';
// Token-aware matrix heatmap (phase 9 §9.4). SVG, theme tokens, shared Tooltip.
// Sequential colour is `color` (default the `--primary` token) at a variable opacity, so
// light/dark follow the theme and no colour scale is hard-coded. `colorFor` switches to
// banded colours (a cell whose value it maps gets that colour at full strength).
// Options: cell value labels (hidden automatically under 28 px cells), legend position, a
// banded legend (`legendItems`), axis text style.

import { useMemo, useState } from 'react';
import { cn } from '@/libs/utils/cn';
import { ResponsiveContainer } from '../primitives/ResponsiveContainer';
import { ChartTooltip } from '../primitives/Tooltip';
import { axisTextProps } from '../primitives/Axis';
import type { AxisTextStyle, LegendPosition, TooltipDatum } from '../types';
import { buildHeatGrid, heatIntensity, type HeatCell } from './_heatmap';

export type HeatmapChartProps = {
  cells: HeatCell[];
  height?: number;
  /** Fixed colour domain; default = the data's own min / max. */
  min?: number;
  max?: number;
  /** Tooltip / legend / cell value text. */
  valueFormat?: (v: number) => string;
  /** Series name shown in the tooltip row. Default = "Value". */
  valueLabel?: string;
  showLegend?: boolean;
  showTooltip?: boolean;
  ariaLabel?: string;
  className?: string;
  /** Token used for the fill. Default = `var(--primary)`. */
  color?: string;
  /** Banded colours: the colour for a value, or undefined to fall back to the sequential scale. */
  colorFor?: (v: number) => string | undefined;
  /** Print each cell's value (only when cells are at least 28 px wide and 14 px tall). Default = false. */
  showValues?: boolean;
  /** Legend placement. Default = 'bottom'. */
  legendPosition?: LegendPosition;
  /** Swatches shown as the legend instead of the gradient (banded colours). */
  legendItems?: Array<{ color: string; label: string }>;
  /** Axis label style. */
  tickStyle?: AxisTextStyle;
};

const PAD = { top: 8, right: 8, bottom: 26, left: 56 };

export function HeatmapChart({
  cells, height = 240, min, max, valueFormat, valueLabel = 'Value', showLegend = true, showTooltip = true,
  ariaLabel, className, color = 'var(--primary)', colorFor, showValues = false, legendPosition = 'bottom',
  legendItems, tickStyle,
}: HeatmapChartProps) {
  const [hover, setHover] = useState<{ xi: number; yi: number } | null>(null);
  const grid = useMemo(() => buildHeatGrid(cells), [cells]);
  const lo = min ?? grid.min;
  const hi = max ?? grid.max;
  const fmt = valueFormat ?? ((v: number) => String(Math.round(v * 100) / 100));
  const text = axisTextProps(tickStyle);
  const side = legendPosition === 'left' || legendPosition === 'right';

  const legend = !showLegend ? null : legendItems?.length ? (
    <ul
      className={cn('flex text-xs text-text-secondary', side ? 'shrink-0 flex-col gap-1.5' : 'flex-wrap items-center gap-x-4 gap-y-1.5', legendPosition === 'top' ? 'mb-2' : legendPosition === 'bottom' ? 'mt-2' : '')}
      role="list"
      data-heat-legend="bands"
    >
      {legendItems.map((it, i) => (
        <li key={i} className="flex items-center gap-2">
          <span aria-hidden="true" className="inline-block size-2.5 rounded-sm" style={{ backgroundColor: it.color }} />
          <span>{it.label}</span>
        </li>
      ))}
    </ul>
  ) : (
    <div
      className={cn('flex items-center gap-2 text-xs text-text-secondary', side ? 'shrink-0 flex-col' : '', legendPosition === 'top' ? 'mb-2' : legendPosition === 'bottom' ? 'mt-2' : '')}
      aria-hidden="true"
      data-heat-legend="scale"
    >
      <span className="tabular-nums">{fmt(side ? hi : lo)}</span>
      <span
        className={cn('rounded-full', side ? 'w-2 flex-1' : 'h-2 flex-1')}
        style={{
          minHeight: side ? 80 : undefined,
          background: `linear-gradient(to ${side ? 'top' : 'right'}, color-mix(in srgb, ${color} 8%, transparent), ${color})`,
        }}
      />
      <span className="tabular-nums">{fmt(side ? lo : hi)}</span>
    </div>
  );

  const plot = (
    <ResponsiveContainer height={height}>
      {({ width }) => {
        const plotW = Math.max(0, width - PAD.left - PAD.right);
        const plotH = Math.max(0, height - PAD.top - PAD.bottom);
        const cw = grid.xs.length ? plotW / grid.xs.length : 0;
        const ch = grid.ys.length ? plotH / grid.ys.length : 0;
        const xEvery = Math.max(1, Math.ceil(56 / Math.max(1, cw)));
        const yEvery = Math.max(1, Math.ceil(14 / Math.max(1, ch)));
        const labelled = showValues && cw >= 28 && ch >= 14;
        const hv = hover ? grid.values[hover.yi]?.[hover.xi] ?? null : null;
        const tip: TooltipDatum[] = hover && hv !== null
          ? [{ seriesId: 'v', seriesName: valueLabel, color: colorFor?.(hv) ?? color, x: grid.xs[hover.xi], y: hv, valueLabel: fmt(hv) }]
          : [];
        return (
          <>
            <svg width={width} height={height} role="img" aria-label={ariaLabel ?? 'Heatmap'} onMouseLeave={() => setHover(null)}>
              {grid.ys.map((label, j) => j % yEvery === 0 && (
                <text key={`y${j}`} x={PAD.left - 6} y={PAD.top + ch * (j + 0.5) + 4} textAnchor="end" {...text}>{label}</text>
              ))}
              {grid.xs.map((label, i) => i % xEvery === 0 && (
                <text key={`x${i}`} x={PAD.left + cw * (i + 0.5)} y={height - 8} textAnchor="middle" {...text}>{label}</text>
              ))}
              {grid.values.map((row, j) => row.map((v, i) => {
                if (v === null) return null;
                const band = colorFor?.(v);
                return (
                  <g key={`${i}:${j}`}>
                    <rect
                      x={PAD.left + cw * i + 0.5} y={PAD.top + ch * j + 0.5}
                      width={Math.max(0, cw - 1)} height={Math.max(0, ch - 1)} rx={2}
                      fill={band ?? color} fillOpacity={band ? 1 : 0.08 + 0.92 * heatIntensity(v, lo, hi)}
                      stroke={hover?.xi === i && hover?.yi === j ? 'var(--border-strong)' : 'none'} strokeWidth={1.5}
                      onMouseEnter={() => showTooltip && setHover({ xi: i, yi: j })}
                    />
                    {labelled && (
                      <text data-cell-label="" x={PAD.left + cw * (i + 0.5)} y={PAD.top + ch * (j + 0.5) + 4} textAnchor="middle"
                        fontSize={10} fill="var(--text-primary)" stroke="var(--surface-base)" strokeWidth={3} paintOrder="stroke" pointerEvents="none">
                        {fmt(v)}
                      </text>
                    )}
                  </g>
                );
              }))}
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
  );

  return (
    <div className={cn('w-full', side && legend ? 'flex flex-row items-stretch gap-3' : '', className)}>
      {(legendPosition === 'top' || legendPosition === 'left') && legend}
      {side ? <div className="min-w-0 flex-1">{plot}</div> : plot}
      {(legendPosition === 'bottom' || legendPosition === 'right') && legend}
    </div>
  );
}
