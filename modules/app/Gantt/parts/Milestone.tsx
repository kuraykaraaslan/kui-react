'use client';
// TODO M4: zero-duration milestone marker — render a 16x16 diamond rotated
// 45deg at the task's start position with `faCalendar` overlay or a pure CSS
// rhombus. Currently a stub so the import graph is stable.
import type { Task } from '../types';

type MilestoneProps = {
  task: Task;
  rangeStart: Date;
  pixelsPerDay: number;
  rowIndex: number;
};

export function Milestone(_props: MilestoneProps) {
  // TODO M4: render diamond at left = diffDays(rangeStart, task.start) * ppd.
  return null;
}
