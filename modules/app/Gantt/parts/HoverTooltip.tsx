'use client';
// TODO M3: hover-tooltip showing task name, dates, % complete, owner, slack.
// Renders via a portal anchored to the pointer position. Stub so importers
// don't need to wait for the M3 surface.
import type { Task } from '../types';

type HoverTooltipProps = {
  task: Task | null;
  x: number;
  y: number;
};

export function HoverTooltip(_props: HoverTooltipProps) {
  // TODO M3: portal a <Popover>-like card next to the cursor.
  return null;
}
