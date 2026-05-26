import type { SectionNode } from './types';
import { countAllSeats, countAvailSeats } from './tree';

/* ─────────────────────────────────────────────
   SVG section fill style (availability-based)
───────────────────────────────────────────── */

export function getSectionStyle(
  node: SectionNode,
  selectedCount: number,
  isHovered: boolean,
): React.CSSProperties {
  const total = countAllSeats(node);
  const avail = countAvailSeats(node);
  const pct = total > 0 ? avail / total : 1;

  let fill: string;
  let fillOpacity: number;
  let stroke: string;

  if (selectedCount > 0) {
    fill = 'var(--primary)';
    fillOpacity = isHovered ? 0.65 : 0.48;
    stroke = 'var(--primary)';
  } else if (total === 0 || pct === 0) {
    fill = 'var(--surface-sunken)';
    fillOpacity = 1;
    stroke = 'var(--border-strong)';
  } else if (pct > 0.5) {
    fill = 'var(--success)';
    fillOpacity = isHovered ? 0.48 : 0.28;
    stroke = 'var(--success)';
  } else if (pct > 0.15) {
    fill = 'var(--warning)';
    fillOpacity = isHovered ? 0.55 : 0.32;
    stroke = 'var(--warning)';
  } else {
    fill = 'var(--error)';
    fillOpacity = isHovered ? 0.55 : 0.32;
    stroke = 'var(--error)';
  }

  return {
    fill,
    fillOpacity,
    stroke,
    strokeWidth: isHovered ? 3 : 1.5,
    transition: 'fill-opacity 0.12s ease, stroke-width 0.12s ease',
    cursor: 'pointer',
  };
}
