# useAsyncControl (hook)

- **id:** `use-async-control`
- **layer:** ui
- **category:** Molecule
- **filePath:** `libs/hooks/useAsyncControl.ts`
- **status:** stable
- **since:** 2026-10

State machine behind ControlTile: idle -> pending -> confirmed / mismatch / failed. `commit` returns a Promise (a rejection rolls the display back to the bound `value`); an optional `reported` value keeps the write pending until the other side agrees, else it ends as mismatch after `timeoutMs`; `confirm` parks the value until `accept()` / `dismiss()`. No transport knowledge. Lives in libs/hooks/useAsyncControl.ts.

## Variants

### Success: pending then confirmed

```tsx
const ctl = useAsyncControl({ value, commit: async (n) => { await api.write(n); setValue(n); } });
```

### Failure: rolls back (with Retry)

```tsx
const ctl = useAsyncControl({ value, commit: () => Promise.reject(new Error('Device offline')) });
// ctl.state === 'failed', ctl.error === 'Device offline', ctl.retry()
```

### Mismatch: the device reports a different value

```tsx
const ctl = useAsyncControl({ value, reported: deviceState, timeoutMs: 1500, commit: write });
```

### Confirm before commit

```tsx
const ctl = useAsyncControl({ value, confirm: true, commit: write });
// ctl.set(next) -> ctl.awaiting -> ctl.accept() | ctl.dismiss()
```

## Full source

```tsx
'use client';
import { useAsyncControl } from '@/libs/hooks/useAsyncControl';

const ctl = useAsyncControl<boolean>({
  value,                 // bound value
  reported,              // optional: what the device reports
  timeoutMs: 1500,       // wait for `reported` to match
  commit: async (next) => { await api.setHeater(next); setValue(next); },
});

// ctl.displayValue, ctl.state, ctl.error, ctl.set(next), ctl.retry()
// with { confirm: true }: ctl.awaiting, ctl.accept(), ctl.dismiss()
```
