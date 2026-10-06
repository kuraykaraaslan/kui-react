'use client';
import { useState } from 'react';
import { TimeWindowPicker, type TimeWindowValue } from '@/modules/ui/TimeWindowPicker';
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
        'Relative presets ("1h", "7d"), an absolute UTC range and the interval / aggregation that go with a window. Controlled: the value is a structural `TimeWindowValue`, nothing here knows about dashboards. Every label is overridable through `messages`.',
      filePath: 'modules/ui/TimeWindowPicker.tsx',
      relatedTo: ['date-range-picker', 'time-picker'],
      designTokens: ['--primary', '--border', '--surface-base', '--surface-sunken', '--text-secondary', '--border-focus'],
      a11y: {
        wcagLevel: 'AA',
        ariaPatterns: ['radiogroup', 'group'],
        notes: 'Presets form a radiogroup; the date inputs and the selects carry accessible names from `messages`.',
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
          title: 'Presets only',
          layout: 'stack' as const,
          preview: <WindowDemo compact />,
          code: `<TimeWindowPicker value={win} onChange={setWin} presets={['1h', '24h', '7d']} allowAbsolute={false} showInterval={false} showAggregation={false} />`,
        },
      ],
    },
  ];
}

function WindowDemo({ compact = false }: { compact?: boolean }) {
  const [w, setW] = useState<TimeWindowValue | null>({ mode: 'relative', last: '24h' });
  return (
    <div className="space-y-2">
      <TimeWindowPicker
        value={w}
        onChange={setW}
        idPrefix={compact ? 'tw-compact' : 'tw-demo'}
        {...(compact ? { presets: ['1h', '24h', '7d'], allowAbsolute: false, showInterval: false, showAggregation: false } : {})}
      />
      <pre className="text-xs text-text-secondary">{JSON.stringify(w)}</pre>
    </div>
  );
}
