'use client';
import { Gantt, type Task, type TimeUnit } from '@/modules/app/Gantt';
import type { ShowcaseComponent } from '../showcase.types';

const today = new Date();
const day = (offset: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + offset);
  d.setHours(0, 0, 0, 0);
  return d;
};

const PROJECT_TASKS: Task[] = [
  { id: 'g1', name: 'Design phase',           isGroup: true, start: day(-14), end: day(7), progress: 70, owner: 'Ada L.' },
  { id: 't1', name: 'Wireframes',             parentId: 'g1', start: day(-14), end: day(-7),  progress: 100, owner: 'Ada L.' },
  { id: 't2', name: 'Visual design',          parentId: 'g1', start: day(-7),  end: day(2),   progress: 80,  owner: 'Jane D.' },
  { id: 't3', name: 'Design review',          parentId: 'g1', start: day(2),   end: day(7),   progress: 20,  owner: 'Team' },
  { id: 'g2', name: 'Implementation',         isGroup: true, start: day(0),  end: day(28), progress: 35,  owner: 'John S.' },
  { id: 't4', name: 'Frontend skeleton',      parentId: 'g2', start: day(0),   end: day(10),  progress: 50,  owner: 'John S.' },
  { id: 't5', name: 'API integration',        parentId: 'g2', start: day(7),   end: day(21),  progress: 25,  owner: 'Mira K.' },
  { id: 't6', name: 'End-to-end tests',       parentId: 'g2', start: day(18),  end: day(28),  progress: 0,   owner: 'QA' },
  { id: 'g3', name: 'Release',                isGroup: true, start: day(28), end: day(35), progress: 0,   owner: 'PM' },
  { id: 't7', name: 'Staging deploy',         parentId: 'g3', start: day(28),  end: day(31),  progress: 0,   owner: 'DevOps' },
  { id: 't8', name: 'Launch',                 parentId: 'g3', start: day(34),  end: day(35),  progress: 0,   owner: 'PM', isMilestone: true },
];

function BasicDemo({ scale }: { scale: TimeUnit }) {
  return (
    <div className="w-full">
      <Gantt tasks={PROJECT_TASKS} scale={scale} ariaLabel="Product launch plan" />
    </div>
  );
}

function CollapsedDemo() {
  const tasks: Task[] = PROJECT_TASKS.map((t) =>
    t.id === 'g2' ? { ...t, collapsed: true } : t,
  );
  return (
    <div className="w-full">
      <Gantt tasks={tasks} scale="week" ariaLabel="Plan with Implementation collapsed" />
    </div>
  );
}

export function buildAppGanttData(): ShowcaseComponent[] {
  return [
    {
      id: 'gantt',
      title: 'Gantt',
      category: 'App',
      abbr: 'Gt',
      description:
        'MS Project / GanttPRO / dhtmlxGantt-style project timeline. M1 ships the scale switcher (day / week / month / quarter / year), a vertical Today line, WBS tree with expand/collapse on the left panel, sticky timeline header with synchronised horizontal + vertical scroll, and absolutely-positioned task bars with a %-progress fill (bg-primary over bg-primary-subtle). Public props for `dependencies`, `baselines`, `criticalPath`, `workingDays`, `holidays`, `onTaskUpdate`, `onDependencyCreate/Delete`, `exportFormats`, `messages`, and `reducedMotion` are accepted but not yet visually wired — they become live in M2 (drag-to-schedule + dependency drawing), M3 (CPM critical-path highlight + hover tooltip), M4 (milestones + baselines + group rollup), M5 (resource leveling + export PNG/PDF/CSV + working-day calendar), and M6 (full keyboard nav + screen-reader announcements + locale). Pixel-identical EJS sibling at modules/app/Gantt/Gantt.ejs.',
      filePath: 'modules/app/Gantt/index.tsx',
      sourceCode: `import { Gantt, type Task } from '@/modules/app/Gantt';

const tasks: Task[] = [
  { id: 'g1', name: 'Design phase',     isGroup: true, start: new Date('2026-05-01'), end: new Date('2026-05-15'), progress: 70 },
  { id: 't1', name: 'Wireframes',       parentId: 'g1', start: new Date('2026-05-01'), end: new Date('2026-05-08'), progress: 100 },
  { id: 't2', name: 'Visual design',    parentId: 'g1', start: new Date('2026-05-08'), end: new Date('2026-05-15'), progress: 80 },
  { id: 'm1', name: 'Launch',           start: new Date('2026-06-01'), end: new Date('2026-06-01'), isMilestone: true },
];

<Gantt
  tasks={tasks}
  scale="week"
  ariaLabel="Q2 release plan"
  // M2 (stubs accepted, not yet visualised):
  // dependencies={[{ id: 'd1', from: 't1', to: 't2', type: 'FS' }]}
  // M3:
  // criticalPath
  // M4:
  // baselines={[{ taskId: 't1', start: ..., end: ... }]}
  // M5:
  // workingDays={[1,2,3,4,5]} holidays={[new Date('2026-05-05')]}
  // exportFormats={['png','csv']}
  // M2 callbacks:
  // onTaskUpdate={async (t) => fetch('/api/tasks/' + t.id, { method: 'PATCH', body: JSON.stringify(t) })}
/>`,
      since: '2026-05',
      status: 'beta',
      composes: ['button'],
      designTokens: [
        '--surface-base',
        '--surface-raised',
        '--surface-overlay',
        '--text-primary',
        '--text-secondary',
        '--border',
        '--border-focus',
        '--primary',
        '--primary-subtle',
        '--primary-fg',
        '--warning',
      ],
      a11y: {
        wcagLevel: 'AA',
        ariaPatterns: ['grid', 'row', 'columnheader', 'gridcell', 'tablist', 'tab'],
        keyboardInteractions: [
          { keys: 'Tab',           action: 'Move focus across scale tabs and collapse buttons' },
          { keys: 'Space / Enter', action: 'Activate scale tab or expand/collapse a WBS group' },
          // TODO M6: Arrow / Home / End for grid navigation, +/- for zoom.
        ],
        notes:
          'Root carries role="grid" with aria-rowcount + aria-colcount; the timeline header row is role="row" with aria-rowindex="1" and each cell is role="columnheader" with aria-colindex. Task bars are role="gridcell" labelled with the task name, dates, and % complete. Scale switcher is a role="tablist"/role="tab" pair so screen readers announce the active scale.',
      },
      variants: [
        {
          title: 'Week scale (default)',
          layout: 'stack' as const,
          preview: <BasicDemo scale="week" />,
          code: `<Gantt tasks={tasks} scale="week" ariaLabel="Product launch plan" />`,
        },
        {
          title: 'Month scale',
          layout: 'stack' as const,
          preview: <BasicDemo scale="month" />,
          code: `<Gantt tasks={tasks} scale="month" ariaLabel="Long-range roadmap" />`,
        },
        {
          title: 'Collapsed group',
          layout: 'stack' as const,
          preview: <CollapsedDemo />,
          code: `// Seed any task with \`collapsed: true\` to hide its children at first paint.
const tasks = base.map((t) => t.id === 'impl' ? { ...t, collapsed: true } : t);
<Gantt tasks={tasks} scale="week" />`,
        },
      ],
    },
  ];
}
