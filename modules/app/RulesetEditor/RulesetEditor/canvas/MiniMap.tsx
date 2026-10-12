'use client';
import { useRef } from 'react';
import { MINI_H, MINI_W, miniToWorld, miniViewport, type MiniMapping } from '../hooks/useMiniMap';

export type MiniItem = { id: string; x: number; y: number; w: number; h: number; error: boolean; colorClass: string };

/**
 * The mini map, 180 x 120 at the bottom right: a box per block (red when it has errors), a frame for the visible
 * part. A click puts that place in the middle of the canvas; dragging follows. Hidden on a phone.
 */
export function MiniMap({ items, mapping, view, size, onGo }: {
  items: MiniItem[];
  mapping: MiniMapping;
  view: { x: number; y: number; k: number };
  /** the canvas in pixels */
  size: { w: number; h: number };
  /** put this world point in the middle of the canvas */
  onGo: (x: number, y: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const vp = miniViewport(mapping, view, size);

  function go(e: React.PointerEvent) {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const p = miniToWorld(mapping, e.clientX - r.left, e.clientY - r.top);
    onGo(p.x, p.y);
  }

  return (
    <div ref={ref} data-testid="ruleset-minimap" aria-hidden="true"
      className="absolute bottom-[3.75rem] right-3 z-[29] overflow-hidden rounded-lg border border-border bg-surface-base opacity-90 shadow-sm max-md:hidden"
      style={{ width: MINI_W, height: MINI_H, cursor: 'pointer', touchAction: 'none' }}
      onPointerDown={(e) => {
        e.stopPropagation();
        e.preventDefault();
        dragging.current = true;
        try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* not every environment can capture */ }
        go(e);
      }}
      onPointerMove={(e) => { if (dragging.current) go(e); }}
      onPointerUp={() => { dragging.current = false; }}
      onPointerCancel={() => { dragging.current = false; }}>
      <svg width={MINI_W} height={MINI_H} viewBox={`0 0 ${MINI_W} ${MINI_H}`} className="block">
        {items.map((n) => (
          <rect key={n.id} data-mini-node={n.id} data-error={n.error ? 'true' : undefined} rx={1} opacity={0.75}
            x={(mapping.ox + (n.x - mapping.x0) * mapping.s).toFixed(1)} y={(mapping.oy + (n.y - mapping.y0) * mapping.s).toFixed(1)}
            width={Math.max(1, n.w * mapping.s).toFixed(1)} height={Math.max(1, n.h * mapping.s).toFixed(1)}
            className={n.error ? undefined : n.colorClass} fill={n.error ? 'var(--error)' : 'currentColor'} />
        ))}
        <rect data-testid="ruleset-minimap-view" x={vp.x.toFixed(1)} y={vp.y.toFixed(1)} width={vp.w.toFixed(1)} height={vp.h.toFixed(1)}
          fill="var(--primary-subtle)" fillOpacity={0.25} stroke="var(--primary)" strokeWidth={1.5} />
      </svg>
    </div>
  );
}
