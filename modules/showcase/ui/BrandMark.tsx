import { cn } from '@/libs/utils/cn';
import { ARMS, FORK, STEM, STROKE_WIDTH, TILE_RADIUS, VIEW_BOX } from '@/brand/geometry.mjs';

/**
 * The kui-react mark, drawn from `brand/geometry.mjs` — the same source
 * `brand/build.mjs` writes the favicon and OG card from.
 *
 * Colors are theme tokens only (`--brand-tone-one`, `--brand-tone-two`,
 * `--brand-tile` in app/globals.css) so the mark tracks light/dark with the
 * chrome; a hex literal here is a defect, and BrandMark.test.ts fails on one.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox={VIEW_BOX} className={cn('shrink-0', className)} aria-hidden="true" focusable="false">
      <rect width="64" height="64" rx={TILE_RADIUS} fill="var(--brand-tile)" />
      <rect x={STEM.x} y={STEM.y} width={STEM.width} height={STEM.height} rx={STEM.radius} fill="var(--brand-tone-one)" />
      {ARMS.map((tip, i) => (
        <path
          key={i}
          d={`M${FORK.x} ${FORK.y} L${tip.x} ${tip.y}`}
          stroke={i === 0 ? 'var(--brand-tone-one)' : 'var(--brand-tone-two)'}
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          fill="none"
        />
      ))}
    </svg>
  );
}
