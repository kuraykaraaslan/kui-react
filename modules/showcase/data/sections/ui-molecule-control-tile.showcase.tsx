'use client';
import { useState } from 'react';
import { ControlButton, ControlSetpoint, ControlSlider, ControlSwitch, ControlTile } from '@/modules/ui/ControlTile';
import { TimeWindowPicker, type TimeWindowValue } from '@/modules/ui/TimeWindowPicker';
import type { ShowcaseComponent } from '../showcase.types';

/** A mock slow write: resolves after 900 ms, or rejects when `fail` is set. */
const slow = (fail = false) => new Promise<void>((resolve, reject) => setTimeout(() => (fail ? reject(new Error('Device offline')) : resolve()), 900));

function SwitchDemo({ fail = false, withReport = false }: { fail?: boolean; withReport?: boolean }) {
  const [on, setOn] = useState(false);
  const [reported, setReported] = useState(false);
  return (
    <div className="w-full max-w-xs">
      <ControlSwitch
        title="Heater"
        value={on}
        reported={withReport ? reported : undefined}
        timeoutMs={2500}
        onCommit={async (next) => { await slow(fail); setOn(next); /* with a report, the device never agrees */ if (!withReport) setReported(next); }}
      />
    </div>
  );
}
function SliderDemo() {
  const [v, setV] = useState(40);
  return (
    <div className="w-full max-w-xs">
      <ControlSlider title="Fan speed" value={v} min={0} max={100} step={5} unit="%" onCommit={async (n) => { await slow(); setV(n); }} />
    </div>
  );
}
function SetpointDemo() {
  const [v, setV] = useState(21);
  return (
    <div className="w-full max-w-xs">
      <ControlSetpoint title="Target temperature" value={v} min={5} max={30} step={0.5} unit="°C" decimals={1} onCommit={async (n) => { await slow(); setV(n); }} />
    </div>
  );
}
function ButtonDemo({ confirm }: { confirm: 'none' | 'confirm' | 'typed' }) {
  return (
    <div className="w-full max-w-xs">
      <ControlButton title="Gateway" label="Reboot" confirm={confirm} confirmText="reboot" onCommit={() => slow()} />
    </div>
  );
}

export function buildControlTileData(): ShowcaseComponent[] {
  return [
    {
      id: 'control-tile',
      title: 'ControlTile',
      category: 'Molecule',
      abbr: 'Ct',
      since: '2026-10',
      description:
        'Async controls: a frame (`ControlTile`) plus `ControlButton`, `ControlSwitch`, `ControlSlider` and `ControlSetpoint`. Each takes the bound `value` and an `onCommit` that returns a Promise, and shows idle -> pending -> confirmed / mismatch / failed with the previous value restored on failure. The slider writes once on release. State machine: `useAsyncControl` (libs/hooks). No transport knowledge; all text is overridable through `messages`.',
      filePath: 'modules/ui/ControlTile/index.ts',
      relatedTo: ['toggle', 'range-slider', 'button'],
      composes: ['toggle', 'range-slider', 'button'],
      designTokens: ['--surface-raised', '--border', '--primary', '--success', '--warning', '--error', '--text-secondary'],
      a11y: {
        wcagLevel: 'AA',
        ariaPatterns: ['switch', 'slider', 'status'],
        notes: 'The status line is an aria-live region; a failure is role="alert". Pending sets aria-busy and disables the input. A bad set-point is a field error (aria-invalid + described-by) and sends nothing.',
      },
      sourceCode: `'use client';
import { ControlSwitch, ControlSlider, ControlSetpoint, ControlButton } from '@/modules/ui/ControlTile';

<ControlSwitch title="Heater" value={on} onCommit={async (next) => { await api.setHeater(next); }} />
<ControlSlider title="Fan speed" value={speed} min={0} max={100} step={5} unit="%" onCommit={(n) => api.setFan(n)} />
<ControlSetpoint title="Target" value={target} min={5} max={30} unit="°C" onCommit={(n) => api.setTarget(n)} />
<ControlButton label="Reboot" confirm="typed" confirmText="reboot" onCommit={(c) => api.reboot(c)} />`,
      variants: [
        {
          title: 'Switch: pending then confirmed',
          layout: 'stack' as const,
          preview: <SwitchDemo />,
          code: `<ControlSwitch title="Heater" value={on} onCommit={write} />`,
        },
        {
          title: 'Switch: failure rolls back (with Retry)',
          layout: 'stack' as const,
          preview: <SwitchDemo fail />,
          code: `<ControlSwitch title="Heater" value={on} onCommit={() => Promise.reject(new Error('Device offline'))} />`,
        },
        {
          title: 'Switch: the device reports a different value (mismatch)',
          layout: 'stack' as const,
          preview: <SwitchDemo withReport />,
          code: `<ControlSwitch title="Heater" value={on} reported={deviceState} timeoutMs={2500} onCommit={write} />`,
        },
        {
          title: 'Slider: commit on release',
          layout: 'stack' as const,
          preview: <SliderDemo />,
          code: `<ControlSlider title="Fan speed" value={speed} min={0} max={100} step={5} unit="%" onCommit={write} />`,
        },
        {
          title: 'Set point: validated entry',
          layout: 'stack' as const,
          preview: <SetpointDemo />,
          code: `<ControlSetpoint title="Target temperature" value={t} min={5} max={30} step={0.5} unit="°C" decimals={1} onCommit={write} />`,
        },
        {
          title: 'Button: none / confirm / typed confirmation',
          layout: 'stack' as const,
          preview: (
            <div className="flex flex-wrap gap-3">
              <ButtonDemo confirm="none" />
              <ButtonDemo confirm="confirm" />
              <ButtonDemo confirm="typed" />
            </div>
          ),
          code: `<ControlButton label="Reboot" confirm="typed" confirmText="reboot" onCommit={(c) => api.reboot(c)} />`,
        },
        {
          title: 'Read-only (no permission)',
          layout: 'stack' as const,
          preview: (
            <div className="w-full max-w-xs">
              <ControlTile title="Heater" state="idle" readOnly>
                <p className="text-sm text-text-secondary">Any control goes in the slot.</p>
              </ControlTile>
            </div>
          ),
          code: `<ControlSwitch title="Heater" value={on} readOnly onCommit={write} />`,
        },
      ],
    },
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
          title: 'Presets only, custom labels',
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
