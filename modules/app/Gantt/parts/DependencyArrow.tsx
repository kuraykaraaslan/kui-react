'use client';
// TODO M2: render an SVG arrow connecting two task bars. Path can be
// orthogonal (default for MS Project / GanttPRO) or cubic Bezier. CPM-marked
// dependencies render in `var(--error)` (TODO M3). Stub kept for stable
// import graph.
import type { Dependency, Task } from '../types';

type DependencyArrowProps = {
  dep: Dependency;
  tasks: Task[];
  rangeStart: Date;
  pixelsPerDay: number;
  taskRowIndex: Record<string, number>;
};

export function DependencyArrow(_props: DependencyArrowProps) {
  // TODO M2: compute start (from-task bar end) and end (to-task bar start)
  // anchor points, then emit <path d="M ... L ... L ..." /> with a marker-end
  // arrowhead.
  return null;
}
