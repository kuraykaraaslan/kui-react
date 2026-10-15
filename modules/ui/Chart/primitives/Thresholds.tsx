'use client';
// modules/ui/Chart/primitives/Thresholds.tsx
//
// Reference lines at fixed values (limits, targets) across the plot. `orientation='horizontal'`
// (the default) draws a line at a y value; 'vertical' at an x value (horizontal bar charts).

import type { PlotRect, ThresholdLine } from '../types';
import { dashArray } from '../charts/_helpers';
import { chartTheme } from '../theme';

type ThresholdsProps = {
  lines?: ThresholdLine[];
  rect: PlotRect;
  /** Value → pixel along the value axis. */
  scale: (value: number) => number;
  orientation?: 'horizontal' | 'vertical';
};

export function Thresholds({ lines, rect, scale, orientation = 'horizontal' }: ThresholdsProps) {
  if (!lines?.length) return null;
  return (
    <g data-chart-thresholds="">
      {lines.map((t, i) => {
        if (typeof t?.value !== 'number' || !Number.isFinite(t.value)) return null;
        const p = scale(t.value);
        const inside = orientation === 'horizontal' ? p >= rect.y - 0.5 && p <= rect.y + rect.height + 0.5 : p >= rect.x - 0.5 && p <= rect.x + rect.width + 0.5;
        if (!inside) return null;
        const color = t.color ?? 'var(--warning)';
        const width = t.width ?? 1;
        const line = orientation === 'horizontal'
          ? { x1: rect.x, x2: rect.x + rect.width, y1: p, y2: p }
          : { x1: p, x2: p, y1: rect.y, y2: rect.y + rect.height };
        return (
          <g key={i} data-threshold={t.value}>
            <line {...line} stroke={color} strokeWidth={width} strokeDasharray={dashArray(t.style ?? 'dashed', width)} strokeLinecap="round" />
            {t.label && (() => {
              // A small tinted pill, opaque so it reads over bars and lines; above the line, or below near the top.
              const w = Math.ceil(t.label.length * 6.2) + 12;
              const h = 16;
              const px = orientation === 'horizontal' ? rect.x + rect.width - w : p + 4;
              const py = orientation === 'horizontal' ? (p - h - 3 < rect.y ? p + 3 : p - h - 3) : rect.y;
              return (
                <g data-threshold-label="">
                  <rect x={px} y={py} width={w} height={h} rx={4} fill={`color-mix(in srgb, ${color} 14%, var(--surface-raised))`} />
                  <text
                    x={px + w / 2}
                    y={py + h / 2}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={chartTheme.fontSize.axis}
                    fontWeight={500}
                    fill={color}
                  >
                    {t.label}
                  </text>
                </g>
              );
            })()}
          </g>
        );
      })}
    </g>
  );
}
