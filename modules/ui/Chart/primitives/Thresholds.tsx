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
            {t.label && (
              <text
                x={orientation === 'horizontal' ? rect.x + rect.width - 2 : p + 4}
                y={orientation === 'horizontal' ? p - 4 : rect.y + 10}
                textAnchor={orientation === 'horizontal' ? 'end' : 'start'}
                fontSize={chartTheme.fontSize.axis}
                fill={color}
                stroke="var(--surface-base)"
                strokeWidth={3}
                paintOrder="stroke"
              >
                {t.label}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}
