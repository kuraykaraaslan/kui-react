'use client';
import { useState } from 'react';
import { TimeWindowPicker, DEFAULT_CALENDAR_PERIODS, type TimeWindowValue } from '@/modules/ui/TimeWindowPicker';
import type { ShowcaseComponent } from '../showcase.types';

export function buildTimeWindowPickerData(): ShowcaseComponent[] {
  return [
    {
      id: 'time-window-picker',
      title: 'TimeWindowPicker',
      category: 'Molecule',
      abbr: 'Tw',
      since: '2026-10',
      description:
        'Relative presets ("1h", "7d"), an optional custom "last N minutes / hours / days", calendar periods ("today", "previous month", optionally "so far"), an absolute UTC range, and the interval / aggregation / time zone that go with a window. Controlled: the value is a structural `TimeWindowValue`, nothing here knows about dashboards. Every label, period names included, is overridable through `messages`.',
      filePath: 'modules/ui/TimeWindowPicker.tsx',
      relatedTo: ['date-range-picker', 'time-picker'],
      designTokens: ['--primary', '--border', '--surface-base', '--surface-sunken', '--text-secondary', '--border-focus'],
      a11y: {
        wcagLevel: 'AA',
        ariaPatterns: ['radiogroup', 'group'],
        notes: 'Presets, Last, Calendar and Custom form one radiogroup; the inputs, the period select, the so-far checkbox (disabled for a past period) and the selects carry accessible names from `messages`.',
      },
      sourceCode: `'use client';
import { TimeWindowPicker, type TimeWindowValue } from '@/modules/ui/TimeWindowPicker';

const [win, setWin] = useState<TimeWindowValue | null>({ mode: 'relative', last: '24h' });
<TimeWindowPicker value={win} onChange={setWin} />`,
      variants: [
        {
          title: 'Default',
          layout: 'stack' as const,
          preview: <WindowDemo />,
          code: `<TimeWindowPicker value={win} onChange={setWin} />`,
        },
        {
          title: 'Calendar periods, custom duration and time zone',
          layout: 'stack' as const,
          preview: <WindowDemo full />,
          code: `<TimeWindowPicker value={win} onChange={setWin} calendarPeriods={DEFAULT_CALENDAR_PERIODS} allowDuration showTimezone />`,
        },
        {
          title: 'Presets only',
          layout: 'stack' as const,
          preview: <WindowDemo compact />,
          code: `<TimeWindowPicker value={win} onChange={setWin} presets={['1h', '24h', '7d']} allowAbsolute={false} showInterval={false} showAggregation={false} />`,
        },
      ],
    },
  ];
}

function WindowDemo({ compact = false, full = false }: { compact?: boolean; full?: boolean }) {
  const [w, setW] = useState<TimeWindowValue | null>(full ? { mode: 'calendar', period: 'current.day', soFar: true } : { mode: 'relative', last: '24h' });
  return (
    <div className="space-y-2">
      <TimeWindowPicker
        value={w}
        onChange={setW}
        idPrefix={compact ? 'tw-compact' : full ? 'tw-full' : 'tw-demo'}
        {...(compact ? { presets: ['1h', '24h', '7d'], allowAbsolute: false, showInterval: false, showAggregation: false } : {})}
        {...(full ? { calendarPeriods: DEFAULT_CALENDAR_PERIODS, allowDuration: true, showTimezone: true } : {})}
      />
      <pre className="text-xs text-text-secondary">{JSON.stringify(w)}</pre>
    </div>
  );
}
