'use client';
import { useState } from 'react';
import { useAsyncControl } from '@/libs/hooks/useAsyncControl';
import { Button } from '@/modules/ui/Button';
import type { ShowcaseComponent } from '../showcase.types';

type Scenario = 'ok' | 'fail' | 'mismatch' | 'confirm';

/** Fake transport: resolves after 600 ms, or rejects with "Device offline" in the fail scenario. */
const transport = (fail: boolean) =>
  new Promise<void>((resolve, reject) => setTimeout(() => (fail ? reject(new Error('Device offline')) : resolve()), 600));

const STATE_TEXT: Record<string, string> = {
  idle: 'Idle',
  pending: 'Pending: writing...',
  confirmed: 'Confirmed',
  mismatch: 'Mismatch: the device reports a different value',
  failed: 'Failed: rolled back to the previous value',
};

function AsyncControlDemo({ scenario }: { scenario: Scenario }) {
  const [value, setValue] = useState(false);
  // In the mismatch scenario the device never agrees: it keeps reporting `false`.
  const reported = scenario === 'mismatch' ? false : undefined;
  const ctl = useAsyncControl<boolean>({
    value,
    reported,
    timeoutMs: 1500,
    confirmedMs: 2000,
    confirm: scenario === 'confirm',
    commit: async (next) => {
      await transport(scenario === 'fail');
      setValue(next);
    },
  });
  const shown = Boolean(ctl.displayValue);
  return (
    <div className="w-full max-w-sm space-y-3 rounded-lg border border-border bg-surface-raised p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-text-primary">Heater: {shown ? 'on' : 'off'}</span>
        <Button size="sm" variant="outline" disabled={ctl.state === 'pending'} onClick={() => ctl.set(!shown)}>
          Turn {shown ? 'off' : 'on'}
        </Button>
      </div>
      <p className="text-xs text-text-secondary" role="status" aria-live="polite">
        State: <span className="font-semibold text-text-primary" data-state={ctl.state}>{STATE_TEXT[ctl.state]}</span>
      </p>
      {ctl.error && <p className="text-xs text-error" role="alert">{ctl.error}</p>}
      {(ctl.state === 'failed' || ctl.state === 'mismatch') && (
        <Button size="sm" variant="secondary" onClick={ctl.retry}>Retry</Button>
      )}
      {ctl.awaiting && (
        <div className="flex items-center gap-2 text-xs text-text-secondary">
          <span>Switch {ctl.awaiting.value ? 'on' : 'off'}?</span>
          <Button size="xs" onClick={ctl.accept}>Confirm</Button>
          <Button size="xs" variant="ghost" onClick={ctl.dismiss}>Cancel</Button>
        </div>
      )}
    </div>
  );
}

export function buildUseAsyncControlData(): ShowcaseComponent[] {
  return [
    {
      id: 'use-async-control',
      title: 'useAsyncControl (hook)',
      category: 'Molecule',
      abbr: 'Ua',
      since: '2026-10',
      description:
        'State machine behind ControlTile: idle -> pending -> confirmed / mismatch / failed. `commit` returns a Promise (a rejection rolls the display back to the bound `value`); an optional `reported` value keeps the write pending until the other side agrees, else it ends as mismatch after `timeoutMs`; `confirm` parks the value until `accept()` / `dismiss()`. No transport knowledge. Lives in libs/hooks/useAsyncControl.ts.',
      filePath: 'libs/hooks/useAsyncControl.ts',
      relatedTo: ['control-tile', 'toggle', 'range-slider'],
      sourceCode: `'use client';
import { useAsyncControl } from '@/libs/hooks/useAsyncControl';

const ctl = useAsyncControl<boolean>({
  value,                 // bound value
  reported,              // optional: what the device reports
  timeoutMs: 1500,       // wait for \`reported\` to match
  commit: async (next) => { await api.setHeater(next); setValue(next); },
});

// ctl.displayValue, ctl.state, ctl.error, ctl.set(next), ctl.retry()
// with { confirm: true }: ctl.awaiting, ctl.accept(), ctl.dismiss()`,
      variants: [
        {
          title: 'Success: pending then confirmed',
          layout: 'stack' as const,
          preview: <AsyncControlDemo scenario="ok" />,
          code: `const ctl = useAsyncControl({ value, commit: async (n) => { await api.write(n); setValue(n); } });`,
        },
        {
          title: 'Failure: rolls back (with Retry)',
          layout: 'stack' as const,
          preview: <AsyncControlDemo scenario="fail" />,
          code: `const ctl = useAsyncControl({ value, commit: () => Promise.reject(new Error('Device offline')) });\n// ctl.state === 'failed', ctl.error === 'Device offline', ctl.retry()`,
        },
        {
          title: 'Mismatch: the device reports a different value',
          layout: 'stack' as const,
          preview: <AsyncControlDemo scenario="mismatch" />,
          code: `const ctl = useAsyncControl({ value, reported: deviceState, timeoutMs: 1500, commit: write });`,
        },
        {
          title: 'Confirm before commit',
          layout: 'stack' as const,
          preview: <AsyncControlDemo scenario="confirm" />,
          code: `const ctl = useAsyncControl({ value, confirm: true, commit: write });\n// ctl.set(next) -> ctl.awaiting -> ctl.accept() | ctl.dismiss()`,
        },
      ],
    },
  ];
}
