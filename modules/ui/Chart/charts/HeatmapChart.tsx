'use client';
// Token-aware matrix heatmap (phase 9 §9.4). SVG, theme tokens, shared Tooltip.
// Sequential colour is `color` (default the `--primary` token): alone, at a variable opacity;
// with `colorLow`, mixed from `colorLow` (lowest) to `color` (highest). Both follow the theme, and
// no colour scale is hard-coded. `colorFor` switches to banded colours (a cell whose value it maps
// gets that colour at full strength).
// Options: cell gap and corner radius, cell value labels (hidden automatically under 28 px cells,
// their colour picked for contrast), legend position and value text, a banded legend
// (`legendItems`), axis text style, filling the parent's height, entrance animation.

import { useMemo, useState } from 'react';
import { cn } from '@/libs/utils/cn';
import { ResponsiveContainer } from '../primitives/ResponsiveContainer';
import { ChartTooltip } from '../primitives/Tooltip';
import { axisTextProps } from '../primitives/Axis';
import type { AxisTextStyle, LegendPosition, TooltipDatum } from '../types';
import { buildHeatGrid, heatIntensity, type HeatCell } from './_heatmap';
import { labelWidth } from './_helpers';
import { useEntrance, valueLabelProps } from './_marks';

export type HeatmapChartProps = {
  cells: HeatCell[];
  height?: number;
  /** Fixed colour domain; default = the data's own min / max. */
  min?: number;
  max?: number;
  /** Tooltip / legend / cell value text. */
  valueFormat?: (v: number) => string;
  /** Legend end text; default = `valueFormat`. */
  legendFormat?: (v: number) => string;
  /** Series name shown in the tooltip row (and before the legend scale). Default = "Value". */
  valueLabel?: string;
  showLegend?: boolean;
  showTooltip?: boolean;
  ariaLabel?: string;
  className?: string;
  /** Colour of the highest value. Default = `var(--primary)`. */
  color?: string;
  /** Colour of the lowest value; unset = `color` fading to clear. */
  colorLow?: string;
  /** Banded colours: the colour for a value, or undefined to fall back to the sequential scale. */
  colorFor?: (v: number) => string | undefined;
  /** Print each cell's value (only when cells are at least 28 px wide and 14 px tall). Default = false. */
  showValues?: boolean;
  /** Value label text style; the colour defaults to whatever reads on the cell. */
  valueLabelStyle?: AxisTextStyle;
  /** Legend placement. Default = 'bottom'. */
  legendPosition?: LegendPosition;
  /** Swatches shown as the legend instead of the gradient (banded colours). */
  legendItems?: Array<{ color: string; label: string }>;
  /** Axis label style. */
  tickStyle?: AxisTextStyle;
  /** Pixels between cells. Default = 2. */
  cellGap?: number;
  /** Cell corner radius in px. Default = 3. */
  cellRadius?: number;
  /** Take the parent's height (the parent must have a definite height). */
  fill?: boolean;
  /** Entrance animation. Default = true. */
  animate?: boolean;
};

/** The sequential fill for an intensity `t` (0..1). */
function seqFill(color: string, low: string | undefined, t: number): { fill: string; fillOpacity?: number } {
  if (low) return { fill: `color-mix(in oklab, ${color} ${Math.round(t * 100)}%, ${low})` };
  return { fill: color, fillOpacity: 0.07 + 0.93 * t };
}

export function HeatmapChart({
  cells, height = 240, min, max, valueFormat, legendFormat, valueLabel = 'Value', showLegend = true, showTooltip = true,
  ariaLabel, className, color = 'var(--primary)', colorLow, colorFor, showValues = false, valueLabelStyle,
  legendPosition = 'bottom', legendItems, tickStyle, cellGap = 2, cellRadius = 3, fill, animate = true,
}: HeatmapChartProps) {
  const [hover, setHover] = useState<{ xi: number; yi: number } | null>(null);
  const grid = useMemo(() => buildHeatGrid(cells), [cells]);
  const enter = useEntrance('grow', animate);
  const lo = min ?? grid.min;
  const hi = max ?? grid.max;
  const fmt = valueFormat ?? ((v: number) => String(Math.round(v * 100) / 100));
  const lfmt = legendFormat ?? fmt;
  const text = axisTextProps(tickStyle);
  const fs = typeof tickStyle?.fontSize === 'number' ? tickStyle.fontSize : 11;
  const side = legendPosition === 'left' || legendPosition === 'right';
  const padLeft = Math.max(24, labelWidth(grid.ys, fs) + 10);
  const low = colorLow;

  const legend = !showLegend ? null : legendItems?.length ? (
    <ul
      className={cn('flex text-xs text-text-secondary', side ? 'shrink-0 flex-col justify-center gap-2' : 'flex-wrap items-center gap-x-4 gap-y-1.5', legendPosition === 'top' ? 'mb-2' : legendPosition === 'bottom' ? 'mt-2' : '')}
      style={side ? undefined : { paddingLeft: padLeft }}
      role="list"
      data-heat-legend="bands"
    >
      {legendItems.map((it, i) => (
        <li key={i} className="flex items-center gap-2">
          <span aria-hidden="true" className="inline-block size-2 rounded-full" style={{ backgroundColor: it.color }} />
          <span>{it.label}</span>
        </li>
      ))}
    </ul>
  ) : (
    <div
      className={cn('flex items-center gap-2 text-xs text-text-secondary', side ? 'shrink-0 flex-col justify-center' : '', legendPosition === 'top' ? 'mb-2' : legendPosition === 'bottom' ? 'mt-2' : '')}
      style={side ? undefined : { paddingLeft: padLeft }}
      aria-hidden="true"
      data-heat-legend="scale"
    >
      {!side && valueLabel && <span className="mr-1">{valueLabel}</span>}
      <span className="tabular-nums">{lfmt(side ? hi : lo)}</span>
      <span
        className={cn('rounded-full', side ? 'w-2 flex-1' : 'h-2 w-full max-w-[200px] flex-1')}
        style={{
          minHeight: side ? 80 : undefined,
          background: `linear-gradient(to ${side ? 'top' : 'right'}, ${low ?? `color-mix(in srgb, ${color} 7%, transparent)`}, ${color})`,
        }}
      />
      <span className="tabular-nums">{lfmt(side ? lo : hi)}</span>
    </div>
  );

  const plot = (
    <ResponsiveContainer height={height} fill={fill}>
      {({ width, height }) => {
        const PAD = { top: 4, right: 4, bottom: 22 + Math.max(0, fs - 11), left: padLeft };
        const plotW = Math.max(0, width - PAD.left - PAD.right);
        const plotH = Math.max(0, height - PAD.top - PAD.bottom);
        const cw = grid.xs.length ? plotW / grid.xs.length : 0;
        const ch = grid.ys.length ? plotH / grid.ys.length : 0;
        const g = Math.min(cellGap, cw / 3, ch / 3);
        const xEvery = Math.max(1, Math.ceil((labelWidth(grid.xs, fs) + 10) / Math.max(1, cw)));
        const yEvery = Math.max(1, Math.ceil((fs + 3) / Math.max(1, ch)));
        const labelled = showValues && cw >= 28 && ch >= 14;
        const hv = hover ? grid.values[hover.yi]?.[hover.xi] ?? null : null;
        const tipColor = hv === null ? color : colorFor?.(hv) ?? seqFill(color, low, heatIntensity(hv, lo, hi)).fill;
        const tip: TooltipDatum[] = hover && hv !== null
          ? [{ seriesId: 'v', seriesName: valueLabel, color: tipColor, x: grid.xs[hover.xi], y: hv, valueLabel: fmt(hv) }]
          : [];
        return (
          <>
            <svg width={width} height={height} role="img" aria-label={ariaLabel ?? 'Heatmap'} onMouseLeave={() => setHover(null)} style={{ display: 'block', overflow: 'visible' }}>
              {grid.ys.map((label, j) => j % yEvery === 0 && (
                <text key={`y${j}`} x={PAD.left - 8} y={PAD.top + ch * (j + 0.5) + fs * 0.35} textAnchor="end" {...text}>{label}</text>
              ))}
              {grid.xs.map((label, i) => i % xEvery === 0 && (
                <text key={`x${i}`} x={PAD.left + cw * (i + 0.5)} y={height - 6} textAnchor="middle" {...text}>{label}</text>
              ))}
              <g ref={enter}>
                {grid.values.map((row, j) => row.map((v, i) => {
                  if (v === null) return null;
                  const band = colorFor?.(v);
                  const t = heatIntensity(v, lo, hi);
                  const seq = band ? { fill: band } : seqFill(color, low, t);
                  const strong = band ? true : low ? t > 0.5 : t > 0.55;
                  return (
                    <g key={`${i}:${j}`}>
                      <rect
                        x={PAD.left + cw * i + g / 2} y={PAD.top + ch * j + g / 2}
                        width={Math.max(0, cw - g)} height={Math.max(0, ch - g)} rx={Math.min(cellRadius, cw / 2, ch / 2)}
                        fill={seq.fill} fillOpacity={seq.fillOpacity}
                        stroke={hover?.xi === i && hover?.yi === j ? 'var(--text-primary)' : 'none'} strokeWidth={1.5}
                        onMouseEnter={() => showTooltip && setHover({ xi: i, yi: j })}
                      />
                      {labelled && (
                        <text data-cell-label="" x={PAD.left + cw * (i + 0.5)} y={PAD.top + ch * (j + 0.5)} textAnchor="middle" dominantBaseline="central"
                          {...valueLabelProps({ fontSize: 10, ...valueLabelStyle }, strong)}>
                          {fmt(v)}
                        </text>
                      )}
                    </g>
                  );
                }))}
              </g>
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
    <div className={cn('w-full', side && legend ? 'flex flex-row items-stretch gap-3' : fill ? 'flex flex-col' : '', fill && 'h-full min-h-0', className)}>
      {(legendPosition === 'top' || legendPosition === 'left') && legend}
      {side || fill ? <div className="min-h-0 min-w-0 flex-1">{plot}</div> : plot}
      {(legendPosition === 'bottom' || legendPosition === 'right') && legend}
    </div>
  );
}
