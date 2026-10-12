'use client';
import type { GuideLine } from '../../graph/snap';

/** The alignment lines shown while a block is dragged. Goes inside the world layer: world coordinates, 1 screen pixel thick. */
export function GuideLines({ guides, zoom }: { guides: GuideLine[]; zoom: number }) {
  if (!guides.length) return null;
  const t = 1 / (zoom || 1);
  return (
    <>
      {guides.map((g) => (
        <div key={`${g.axis}-${g.at}`} data-testid="ruleset-guide" aria-hidden="true"
          className="pointer-events-none absolute bg-primary opacity-65"
          style={{
            zIndex: 6,
            ...(g.axis === 'x'
              ? { left: g.at, top: g.from, width: t, height: g.to - g.from }
              : { left: g.from, top: g.at, width: g.to - g.from, height: t }),
          }} />
      ))}
    </>
  );
}
