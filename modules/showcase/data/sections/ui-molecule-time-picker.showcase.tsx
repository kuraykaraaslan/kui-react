'use client';
import { useState } from 'react';
import { TimePicker } from '@/modules/ui/DateRangePicker';
import type { ShowcaseComponent } from '../showcase.types';

function TimePickerDemo() {
  const [t, setT] = useState('09:00');
  return <TimePicker id="tp-standalone" label="Meeting time" value={t} onChange={setT} hint="24-hour format" />;
}
function TimePickerErrorDemo() {
  const [t, setT] = useState('');
  return <TimePicker id="tp-error" label="Pickup time" required error="Pickup time is required." value={t} onChange={setT} />;
}

// Promotes the existing `TimePicker` (native `type="time"` input, previously
// only surfaced as a variant inside DateRangePicker's entry) to its own
// top-level catalog entry so it is independently discoverable via the
// registry / /api/registry / llms.txt.
export function buildTimePickerData(): ShowcaseComponent[] {
  return [
    {
      id: 'time-picker',
      title: 'TimePicker',
      category: 'Molecule',
      abbr: 'Tp',
      description: 'Native `<input type="time">`-based time field with label/hint/error slots, matching the Input/DatePicker pattern. M1 baseline — hour/minute only, no timezone or 12h/24h toggle yet (tracked for the DateTimePicker milestone).',
      filePath: 'modules/ui/DateRangePicker.tsx',
      since: '2026-09',
      whenNotToUse: 'For combined date + time selection, wait for the upcoming DateTimePicker (composes DatePicker + TimePicker) rather than pairing these two manually.',
      sourceCode: `'use client';
import { TimePicker } from '@/modules/ui/DateRangePicker';

const [time, setTime] = useState('09:00');
<TimePicker id="meeting" label="Meeting time" value={time} onChange={setTime} hint="24-hour format" />`,
      variants: [
        {
          title: 'Default',
          layout: 'stack' as const,
          preview: <TimePickerDemo />,
          code: `const [time, setTime] = useState('09:00');\n<TimePicker id="meeting" label="Meeting time" value={time} onChange={setTime} hint="24-hour format" />`,
        },
        {
          title: 'Required / error',
          layout: 'stack' as const,
          preview: <TimePickerErrorDemo />,
          code: `<TimePicker id="pickup" label="Pickup time" required error="Pickup time is required." value={time} onChange={setTime} />`,
        },
      ],
    },
  ];
}
