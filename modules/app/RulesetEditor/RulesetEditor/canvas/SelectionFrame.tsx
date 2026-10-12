'use client';
import type { Frame } from '../../graph/boxselect';

/** The frame drawn while selecting with a drag. Coordinates are pixels inside the canvas. */
export function SelectionFrame({ frame }: { frame: Frame | null }) {
  if (!frame) return null;
  return (
    <div data-testid="ruleset-box" aria-hidden="true"
      className="pointer-events-none absolute z-[25] border border-dashed border-primary bg-primary-subtle opacity-50"
      style={{ left: frame.x0, top: frame.y0, width: frame.x1 - frame.x0, height: frame.y1 - frame.y0 }} />
  );
}
