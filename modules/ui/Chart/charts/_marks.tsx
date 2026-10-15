'use client';
// Shared marks of the cartesian charts: point shapes (circle, square, diamond, triangle), value
// labels with the kit's text style, and the entrance animation every chart can switch off.

import { useCallback, useRef, type SVGProps } from 'react';
import { animationDuration } from '../theme';
import type { AxisTextStyle, PointShape } from '../types';
import { axisTextProps } from '../primitives/Axis';
import { pointPath } from './_helpers';

type MarkProps = Omit<SVGProps<SVGPathElement & SVGCircleElement>, 'ref'> & {
  shape?: PointShape;
  x: number;
  y: number;
  r: number;
};

/** One point mark. A circle is a `<circle>`; the other shapes are paths. */
export function PointMark({ shape = 'circle', x, y, r, ...rest }: MarkProps) {
  if (shape === 'circle') return <circle cx={x} cy={y} r={r} {...rest} />;
  return <path d={pointPath(shape, x, y, r)} {...rest} />;
}

/**
 * SVG text props for a value label: the axis text look, a halo so it reads over grid and marks. On a
 * filled mark (`onFill`) the text takes the surface colour: white on the saturated light-theme
 * palette, dark on the lighter dark-theme one.
 */
export function valueLabelProps(style?: AxisTextStyle, onFill = false) {
  const base = axisTextProps(style);
  return {
    ...base,
    fontSize: style?.fontSize ?? 11,
    fontWeight: style?.fontWeight ?? 500,
    fill: style?.color ?? (onFill ? 'var(--surface-base)' : 'var(--text-primary)'),
    ...(onFill ? {} : { stroke: 'var(--surface-raised)', strokeWidth: 3, paintOrder: 'stroke' as const, strokeLinejoin: 'round' as const }),
    pointerEvents: 'none' as const,
  };
}

export type Entrance = 'reveal-x' | 'reveal-y' | 'reveal-x-reverse' | 'grow';

const FRAMES: Record<Entrance, Keyframe[]> = {
  'reveal-x': [{ clipPath: 'inset(-8px 100% -8px -8px)' }, { clipPath: 'inset(-8px -8px -8px -8px)' }],
  'reveal-x-reverse': [{ clipPath: 'inset(-8px -8px -8px 100%)' }, { clipPath: 'inset(-8px -8px -8px -8px)' }],
  'reveal-y': [{ clipPath: 'inset(100% -8px -8px -8px)' }, { clipPath: 'inset(-8px -8px -8px -8px)' }],
  grow: [{ opacity: 0, transform: 'scale(0.9)' }, { opacity: 1, transform: 'scale(1)' }],
};

/**
 * A callback ref that plays the entrance animation once, the first time the element mounts.
 * Uses the Web Animations API (absent in jsdom: nothing happens); honours reduced motion.
 */
export function useEntrance(kind: Entrance, enabled = true) {
  const played = useRef(false);
  return useCallback((el: SVGGElement | null) => {
    if (!el || played.current) return;
    played.current = true;
    if (!enabled || typeof el.animate !== 'function' || animationDuration(1) === 0) return;
    if (kind === 'grow') {
      el.style.transformBox = 'fill-box';
      el.style.transformOrigin = 'center';
    }
    el.animate(FRAMES[kind], { duration: kind === 'grow' ? 500 : 700, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
  }, [kind, enabled]);
}
