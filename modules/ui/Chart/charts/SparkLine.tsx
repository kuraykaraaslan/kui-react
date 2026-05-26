'use client';
// modules/ui/Chart/charts/SparkLine.tsx
//
// Inline mini line — no axes, no grid, no legend. Drawn in a fixed
// box (default 80×24) suitable for table cells or KPI cards. Accepts
// either a `series` array (consistent with the other charts) or a
// shorthand `values` array for one-shot usage.

import { useMemo } from 'react';
import { cn } from '@/libs/utils/cn';
import { ResponsiveContainer } from '../primitives/ResponsiveContainer';
import { paletteColor } from '../theme';
import type { Series } from '../types';
import { smoothPath, linePath, yExtent } from './_helpers';

type SparkLineProps = {
  /** Optional Series array. If omitted, `values` is required. */
  series?: Series[];
  /** Shorthand single-series numeric array. */
  values?: number[];
  /** Fixed pixel width. Default = 80. */
  width?: number;
  /** Fixed pixel height. Default = 24. */
  height?: number;
  /** Stroke width. Default = 1.5. */
  strokeWidth?: number;
  /** Smooth curve. Default = true. */
  smooth?: boolean;
  /** Fill below the line. Default = false. */
  filled?: boolean;
  /** Optional color override. Default = `var(--primary)`. */
  color?: string;
  /** Tailwind className passthrough. */
  className?: string;
  /** A11y label. Default = "Sparkline". */
  ariaLabel?: string;
};

export function SparkLine({
  series,
  values,
  width = 80,
  height = 24,
  strokeWidth = 1.5,
  smooth = true,
  filled = false,
  color,
  className,
  ariaLabel = 'Sparkline',
}: SparkLineProps) {
  const resolved = useMemo<Series[]>(() => {
    if (series && series.length) return series;
    if (values && values.length) {
      return [
        {
          id: 'spark',
          name: 'spark',
          data: values.map((y, i) => ({ x: i, y })),
        },
      ];
    }
    return [];
  }, [series, values]);

  const { min, max } = useMemo(() => yExtent(resolved), [resolved]);
  const s = resolved[0];

  return (
    <span
      className={cn('inline-block align-middle', className)}
      style={{ width, height }}
      role="img"
      aria-label={ariaLabel}
    >
      <ResponsiveContainer height={height} className="!w-full">
        {({ width: w }) => {
          if (!s || s.data.length === 0) return <svg width={w} height={height} />;
          const n = s.data.length;
          const stroke = color ?? paletteColor(0, s.color);
          const points = s.data.map((p, i) =>
            p.y === null || p.y === undefined
              ? null
              : {
                  x: n === 1 ? w / 2 : (i / (n - 1)) * (w - 2) + 1,
                  y:
                    max === min
                      ? height / 2
                      : height - ((p.y - min) / (max - min)) * (height - 2) - 1,
                },
          );
          const path = smooth ? smoothPath(points) : linePath(points);
          const pts = points.filter(Boolean) as Array<{ x: number; y: number }>;
          const areaPath =
            filled && pts.length > 1
              ? `${path} L${pts[pts.length - 1].x} ${height} L${pts[0].x} ${height} Z`
              : '';
          return (
            <svg width={w} height={height} preserveAspectRatio="none">
              {areaPath && <path d={areaPath} fill={stroke} opacity={0.15} />}
              <path
                d={path}
                fill="none"
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          );
        }}
      </ResponsiveContainer>
    </span>
  );
}
