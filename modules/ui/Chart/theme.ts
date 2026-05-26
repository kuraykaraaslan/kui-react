// modules/ui/Chart/theme.ts
//
// Token-aware palette + style helpers for the @/modules/ui/Chart library.
//
// All colors are sourced from the CSS variables declared in `app/globals.css`
// — never hard-coded hex values. Dark mode is honoured automatically because
// the variables are re-defined under `.dark { }`.
//
// `defaultPalette` is the rotation used for multi-series charts when a
// caller does not supply per-series colors. The order matches the M5+
// migration target of the existing domain charts so visual identity is
// preserved when those callers move onto the primitives.

export const defaultPalette = [
  'var(--primary)',
  'var(--secondary)',
  'var(--success)',
  'var(--warning)',
  'var(--error)',
  'var(--info)',
  'var(--primary-active)',
  'var(--text-secondary)',
] as const;

/** Resolve a fill / stroke color for a series by index, with safe wrap-around. */
export function paletteColor(index: number, override?: string): string {
  if (override) return override;
  return defaultPalette[index % defaultPalette.length];
}

export const chartTheme = {
  /** Plotting-area background — usually transparent so the host card shows through. */
  background: 'transparent',
  /** Axis line + tick label colors. */
  axisStroke: 'var(--border)',
  axisText: 'var(--text-secondary)',
  /** Grid lines (lighter than axis). */
  gridStroke: 'var(--border)',
  /** Tooltip surface + text. */
  tooltipBg: 'var(--surface-raised)',
  tooltipBorder: 'var(--border)',
  tooltipText: 'var(--text-primary)',
  tooltipMutedText: 'var(--text-secondary)',
  /** Crosshair line color. */
  crosshair: 'var(--border-strong)',
  /** Legend swatch border. */
  legendSwatchBorder: 'var(--border)',
  /** Standard plotting font sizes (kept tight to mirror EJS sibling). */
  fontSize: {
    axis: 11,
    tooltip: 12,
    legend: 12,
  },
} as const;

/**
 * Reduced-motion-aware animation duration in ms.
 * The chart consumer should pass this to inline `style.transition` values.
 * Returns 0 when the OS reports a reduced-motion preference.
 */
export function animationDuration(base = 250): number {
  if (typeof window === 'undefined') return base;
  const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  return mq?.matches ? 0 : base;
}
