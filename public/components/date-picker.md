# DatePicker

- **id:** `date-picker`
- **layer:** ui
- **category:** Molecule
- **filePath:** `modules/ui/DatePicker.tsx`
- **status:** stable
- **since:** 2025-02

Native date input ile label + hint + error anatomy. Date | null değer modeli, min/max kısıtlaması, disabled tooltip desteği.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--error`
- `--error-subtle`
- `--primary`
- `--secondary`
- `--surface-base`
- `--surface-sunken`
- `--text-primary`
- `--text-secondary`

## Variants

### Default

```tsx
<DatePicker id="date" label="Appointment date" hint="Select a future date." value={date} onChange={setDate} />
```

### With value

```tsx
<DatePicker id="start" label="Start date" value={new Date('2026-06-15')} onChange={setDate} />
```

### Error / Disabled

```tsx
<DatePicker id="due" label="Due date" error="Please select a date." required />
<DatePicker id="locked" label="Locked date" value={date} disabled />
```

## Full source

```tsx
'use client';
import { cn } from '@/libs/utils/cn';

export function DatePicker({ id, label, hint, error, value, onChange, disabled, required, min, max, className }) {
  const formatted = value && !isNaN(value.getTime()) ? value.toISOString().split('T')[0] : '';
  function handleChange(e) {
    if (!e.target.value) { onChange(null); return; }
    const d = new Date(e.target.value);
    onChange(isNaN(d.getTime()) ? null : d);
  }
  return (
    <div className={cn('space-y-1', className)}>
      <label htmlFor={id} className="block text-sm font-medium text-text-primary">
        {label}{required && <span className="text-error ml-1" aria-hidden="true">*</span>}
      </label>
      <input id={id} type="date" value={formatted} onChange={handleChange} disabled={disabled} required={required} min={min} max={max} aria-invalid={!!error}
        className={cn('block w-full rounded-md border px-3 py-2 text-sm transition-colors text-text-primary bg-surface-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface-sunken', error ? 'border-error ring-1 ring-error bg-error-subtle' : 'border-border')} />
      {hint && !error && <p className="text-xs text-text-secondary">{hint}</p>}
      {error && <p className="text-xs text-error" role="alert">{error}</p>}
    </div>
  );
}
```
