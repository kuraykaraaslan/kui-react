# Gantt Component — Milestone Roadmap

> Living document. Update on every milestone landing. M1 + M2 implemented; M3–M6 future work.

## M1 — Timeline + Bars ✅ (commit `fdae96d`)

- Scale switcher (Day / Week / Month / Quarter / Year)
- WBS tree (parent/child, expand/collapse)
- Task bars with progress fill
- Sticky timeline header + synchronized horizontal/vertical scroll
- Today marker
- ARIA grid + tablist pattern
- Telemetry hooks (`scale-change`, `task-toggle`)

## M2 — Drag + Dependencies ✅ (this milestone)

**Behaviour**
- Bar move (whole-bar drag, snap to day)
- Bar resize from start edge / end edge (snap to day, min 1-day duration)
- Progress thumb drag (0–100 clamp)
- Dependency creation via right-edge handle → drag-to-target bar (FS by default)
- Dependency selection + Delete key removal
- Escape cancels active drag / dependency draw
- Optimistic local update + rollback if `onTaskUpdate` / `onDependencyCreate` rejects

**Architecture**
- Per-instance Zustand store (`store.ts`) replaces local React state — owns `scale`, `collapsed`, `workingTasks`, `dependencies`, `drag`, `depDraw`, `selectedDepId`.
- Pointer-based (`setPointerCapture`) — works with mouse + touch + pen.
- `<svg>` overlay (`DependencyLayer`) renders all arrows + ghost path; orthogonal routing per FS / SS / FF / SF type; `marker-end` arrowhead.
- `index.tsx` shrunk to orchestrator (~150 lines); `parts/GanttToolbar`, `parts/GanttBody`, `parts/DependencyLayer` split out per the project's ≤250-line rule.

**Public API additions**
- `onTaskUpdate(task)` now invoked on drag commit.
- `onDependencyCreate(dep)` invoked on rubber-band release over a valid target.
- `onDependencyDelete(id)` invoked on Delete-key on selected dependency.
- `dependencies` prop now seeds the overlay (previously stubbed).

## M3 — Critical Path + Tooltip 🟡 (future)

- Forward / backward pass CPM (`useCriticalPath`)
- `task.critical = true` → bar gets `var(--error)` border + warning fill; critical dependencies stroke `var(--error)`
- Hover tooltip (portal) with task name, range, duration, owner, progress, predecessors
- Two-row header (e.g. days under weeks) for day & week scales

## M4 — Milestones + Baselines + Weekends 🟡 (future)

- Diamond rendering for `isMilestone` tasks (`parts/Milestone.tsx`)
- Baseline ghost bar (`parts/BaselineGhost.tsx`) — planned vs actual
- Group rollup bar style (bracketed summary bar)
- Weekend column shading via `workingDays` prop

## M5 — Calendar + Export 🟡 (future)

- Working-day / holiday calendar — skip non-working days in snap math, shade columns
- Export PNG / PDF / CSV (toolbar menu)
- Resource leveling helper (over-allocation highlight)

## M6 — A11y + i18n + Performance 🟡 (future)

- Keyboard grid nav (↑↓←→/Home/End/PageUp/PageDown)
- +/− zoom shortcuts (already stubbed in `useZoom`)
- Locale-aware month/day names + RTL support
- `prefers-reduced-motion` honoured for drag/draw animations
- Virtualized row rendering for 1000+ tasks

---

## EJS parity note

EJS twin (`02_EJS_Components/modules/app/Gantt`) **removed** in this milestone (user decision — Gantt not needed in the EJS surface). Future Gantt work in the NextJS repo does **not** require an EJS parallel.

## File map (post-M2)

```
modules/app/Gantt/
├── PLAN.MD                       ← this file
├── index.tsx                     ← orchestrator + provider
├── store.ts                      ← Zustand per-instance store (M2)
├── types.ts
├── hooks/
│   ├── useTimelineScale.ts       ← M1
│   ├── useScroll.ts              ← M1
│   ├── useZoom.ts                ← M1
│   ├── useTaskDrag.ts            ← M2 (real impl)
│   ├── useDependencyDraw.ts      ← M2 (real impl)
│   └── useCriticalPath.ts        ← M3 stub
└── parts/
    ├── GanttToolbar.tsx          ← M2 (split from index)
    ├── GanttBody.tsx             ← M2 (split from index)
    ├── TaskListSide.tsx          ← M1
    ├── TimelineHeader.tsx        ← M1
    ├── TaskBar.tsx               ← M1 + M2 handles
    ├── TodayLine.tsx             ← M1
    ├── DependencyLayer.tsx       ← M2
    ├── DependencyArrow.tsx       ← M2 (real impl)
    ├── BaselineGhost.tsx         ← M4 stub
    ├── Milestone.tsx             ← M4 stub
    └── HoverTooltip.tsx          ← M3 stub
```
