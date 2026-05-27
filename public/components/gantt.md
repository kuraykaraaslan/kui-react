# Gantt

- **id:** `gantt`
- **layer:** app
- **category:** App
- **filePath:** `modules/app/Gantt/index.tsx`
- **status:** beta
- **since:** 2026-05

MS Project / GanttPRO / dhtmlxGantt-style project timeline. M1 ships the scale switcher (day / week / month / quarter / year), a vertical Today line, WBS tree with expand/collapse on the left panel, sticky timeline header with synchronised horizontal + vertical scroll, and absolutely-positioned task bars with a %-progress fill. M2 adds full interactivity: drag a bar to reschedule (snap to day), drag the left/right edges to resize, drag the white progress thumb to change %, and drag from the right-edge blue dot to another bar to draw an FS dependency. Dependencies render as orthogonal SVG arrows with a marker-end arrowhead; click an arrow then press Delete to remove it. All mutations are optimistic and roll back automatically if `onTaskUpdate` / `onDependencyCreate` rejects. Internal state is owned by a per-instance Zustand store (`store.ts`). Public props for `baselines`, `criticalPath`, `workingDays`, `holidays`, `exportFormats`, and `reducedMotion` are accepted but not yet wired — they become live in M3 (CPM highlight + hover tooltip), M4 (milestones + baselines + weekends), M5 (export + working-day calendar), and M6 (full keyboard nav + locale + virtualisation).

## Depends on

- `button`

## Accessibility

- WCAG: AA
- ARIA patterns: grid, row, columnheader, gridcell, tablist, tab
- Keyboard:
  - `Tab` — Move focus across scale tabs, collapse buttons, and dependency arrows
  - `Space / Enter` — Activate scale tab or expand/collapse a WBS group
  - `Delete` — Remove the currently selected dependency arrow
  - `Escape` — Cancel an in-flight drag or dependency draw

Root carries role="grid"; the timeline header row is role="row" with each cell role="columnheader". Task bars are role="gridcell" labelled with the task name, dates, and % complete. Resize handles and the progress thumb are <button> elements so they are reachable by assistive tech. Dependency arrows are role="button" with keyboard-activatable selection. Scale switcher is a role="tablist"/role="tab" pair.

## Design tokens consumed

- `--surface-base`
- `--surface-raised`
- `--surface-overlay`
- `--text-primary`
- `--text-secondary`
- `--border`
- `--border-focus`
- `--primary`
- `--primary-subtle`
- `--primary-fg`
- `--warning`

## Variants

### Week scale (default)

```tsx
<Gantt tasks={tasks} scale="week" ariaLabel="Product launch plan" />
```

### Month scale

```tsx
<Gantt tasks={tasks} scale="month" ariaLabel="Long-range roadmap" />
```

### Collapsed group

```tsx
// Seed any task with `collapsed: true` to hide its children at first paint.
const tasks = base.map((t) => t.id === 'impl' ? { ...t, collapsed: true } : t);
<Gantt tasks={tasks} scale="week" />
```

### Dependencies (FS + SS)

```tsx
const dependencies = [
  { id: 'd-t1-t2', from: 't1', to: 't2', type: 'FS' }, // Finish-to-Start
  { id: 'd-t4-t5', from: 't4', to: 't5', type: 'SS' }, // Start-to-Start
];

<Gantt tasks={tasks} dependencies={dependencies} scale="week" />
```

### Interactive (drag + dependencies)

```tsx
const [tasks, setTasks] = useState<Task[]>(initial);
const [deps,  setDeps]  = useState<Dependency[]>([]);

<Gantt
  tasks={tasks}
  dependencies={deps}
  scale="week"
  onTaskUpdate={(t) => setTasks((prev) => prev.map((p) => (p.id === t.id ? t : p)))}
  onDependencyCreate={(d) => setDeps((prev) => [...prev, d])}
  onDependencyDelete={(id) => setDeps((prev) => prev.filter((d) => d.id !== id))}
/>
```

## Full source

```tsx
import { Gantt, type Dependency, type Task } from '@/modules/app/Gantt';
import { useState } from 'react';

export function MyPlan() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 't1', name: 'Wireframes',   start: new Date('2026-05-01'), end: new Date('2026-05-08'), progress: 100 },
    { id: 't2', name: 'Visual design', start: new Date('2026-05-08'), end: new Date('2026-05-15'), progress: 60 },
    { id: 't3', name: 'Launch',       start: new Date('2026-06-01'), end: new Date('2026-06-01'), isMilestone: true },
  ]);
  const [deps, setDeps] = useState<Dependency[]>([
    { id: 'd1', from: 't1', to: 't2', type: 'FS' },
  ]);

  return (
    <Gantt
      tasks={tasks}
      dependencies={deps}
      scale="week"
      ariaLabel="Q2 release plan"
      onTaskUpdate={(t) => setTasks((prev) => prev.map((p) => (p.id === t.id ? t : p)))}
      onDependencyCreate={(d) => setDeps((prev) => [...prev, d])}
      onDependencyDelete={(id) => setDeps((prev) => prev.filter((d) => d.id !== id))}
    />
  );
}
```
