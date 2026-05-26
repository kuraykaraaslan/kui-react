# Gantt / Timeline — Yeni Bileşen Planı (EJS Pariteli)

> Mevcut **yok** — her iki repoda yeni bileşen.

## Kuzey Yıldızı
MS Project + Smartsheet + GanttPRO + dhtmlxGantt seviyesi: task bars, dependency arrows, critical path, milestones, baseline, drag to schedule, accessible.

---

## Hedef yapı
```
modules/app/Gantt/
├── index.tsx              ← named export
├── types.ts               ← Task, Dependency, TimeUnit, Baseline
├── parts/
│   ├── TaskListSide.tsx   ← sol panel: WBS hierarchy + columns (name, owner, %)
│   ├── TimelineHeader.tsx ← scale: day/week/month/quarter/year
│   ├── TaskBar.tsx        ← drag handles (move, resize start, resize end, progress)
│   ├── Milestone.tsx      ← diamond shape
│   ├── DependencyArrow.tsx ← FS/SS/FF/SF link
│   ├── TodayLine.tsx
│   ├── BaselineGhost.tsx  ← planned vs actual
│   └── HoverTooltip.tsx
└── hooks/
    ├── useTimelineScale.ts ← time unit + pixel/day
    ├── useTaskDrag.ts
    ├── useDependencyDraw.ts ← drag from bar edge to another bar
    ├── useCriticalPath.ts  ← CPM algorithm
    ├── useScroll.ts        ← sync side + timeline
    └── useZoom.ts          ← scale level
```

### EJS paralel
- Gantt.ejs root + partials (_task-list/_timeline-header/_bar/_dep-arrow/_milestone).
- Scripts: scale.js, task-drag.js, dep-draw.js, critical-path.js, scroll.js, zoom.js.

---

## Milestone'lar

### M1 — Timeline + bars
- Scale switcher: day / week / month / quarter / year.
- Today vertical line.
- Task bar: render start–end with %progress fill.
- WBS tree on left panel (collapse/expand groups).
- Sticky header + horizontal scroll sync.

### M2 — Drag & schedule
- Drag bar to move (snap to day/week).
- Drag start/end edge to resize.
- Drag progress handle to set %.
- Drag from bar end to another bar → create dependency (FS, SS, FF, SF).
- Drag dependency endpoint to re-target.

### M3 — Dependencies + CPM
- Render dependency arrows (cubic Bezier veya orthogonal).
- Validate: cycle detection.
- Auto-schedule on dep change.
- Critical Path Method: longest path highlight (kırmızı).
- "What-if" mode: drag, geri al.

### M4 — Milestones + baseline + groups
- Milestone (zero duration, diamond marker).
- Baseline ghost (planned vs current).
- Group/summary bars (otomatik rollup from children).
- Constraints (must-start-on, deadline).

### M5 — Premium
- Resource leveling (overallocation warning).
- Calendar (non-working days).
- Export: PNG, PDF, CSV.
- Print-friendly stylesheet.
- Sub-views (resource histogram).

### M6 — A11y + i18n
- Klavye nav: arrow → cell, Tab → bar, +/- zoom.
- Screen reader: "Task 'Design phase', March 5 to March 20, 60% complete, critical".
- Reduced motion.
- `messages` prop.
- Locale-aware date format.

---

## Public API
```ts
type GanttProps = {
  tasks: Task[];
  dependencies?: Dependency[];
  baselines?: Baseline[];
  scale?: 'day' | 'week' | 'month' | 'quarter' | 'year';
  workingDays?: number[];
  holidays?: Date[];
  criticalPath?: boolean;
  onTaskUpdate?: (task: Task) => Promise<void>;
  onDependencyCreate?: (dep: Dependency) => Promise<void>;
  onDependencyDelete?: (id: string) => Promise<void>;
  exportFormats?: ('png' | 'pdf' | 'csv')[];
  messages?: Partial<GanttMessages>;
  reducedMotion?: boolean;
};
```

## Perf
- Core ≤ 30 kB.
- Virtualization: 5 000 task @ ≥ 50 fps.
- CPM algorithm < 50 ms @ 1 000 tasks.

## DoD
- [ ] NextJS + EJS paralel yeni dosyalar.
- [ ] axe-core 0 violations.
- [ ] CPM doğruluk testi (referans Gantt verisi ile karşılaştır).
- [ ] Showcase: basic / dependencies / critical path / baseline / resource variant'ları.
