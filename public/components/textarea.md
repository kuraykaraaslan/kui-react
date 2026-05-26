# Textarea

- **id:** `textarea`
- **layer:** ui
- **category:** Molecule
- **filePath:** `modules/ui/Textarea.tsx`
- **status:** stable
- **since:** 2025-02

Label + textarea + hint + error anatomy. Vertical resizing is enabled via resize-y and the parts are linked through aria-describedby.

## Used by

- `form-builder`
- `reviews-review-submit-form`

## Design tokens consumed

- `--border`
- `--border-focus`
- `--error`
- `--error-subtle`
- `--primary`
- `--secondary`
- `--surface-base`
- `--surface-sunken`
- `--text-disabled`
- `--text-primary`
- `--text-secondary`

## Variants

### Default

```tsx
<Textarea id="message" label="Message" placeholder="Write your message…" hint="Max 500 characters." />
```

### Error

```tsx
<Textarea id="message" label="Message" error="Message is required." required />
```

### Disabled

```tsx
<Textarea id="message" label="Message" placeholder="Not editable" disabled />
```

### Character counter

```tsx
function Demo() {
  const MAX = 200;
  const [v, setV] = useState('');
  return (
    <div className="space-y-1">
      <Textarea id="bio" label="Bio" value={v} maxLength={MAX} rows={3}
        onChange={(e) => setV(e.target.value)} />
      <p className={`text-xs text-right ${MAX - v.length < 20 ? 'text-error' : 'text-text-secondary'}`}>
        {MAX - v.length} characters remaining
      </p>
    </div>
  );
}
```

## Full source

```tsx
'use client';
import { cn } from '@/libs/utils/cn';

export function Textarea({ id, label, hint, error, disabled, required, rows = 4, className, ...props }) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;
  return (
    <div className={cn('space-y-1', className)}>
      <label htmlFor={id} className="block text-sm font-medium text-text-primary">
        {label}{required && <span className="text-error ml-1" aria-hidden="true">*</span>}
      </label>
      <textarea id={id} rows={rows} disabled={disabled} required={required} aria-describedby={describedBy} aria-invalid={!!error}
        className={cn('block w-full rounded-md border px-3 py-2 text-sm transition-colors resize-y text-text-primary placeholder:text-text-disabled focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface-sunken', error ? 'border-error ring-1 ring-error bg-error-subtle' : 'border-border bg-surface-base', className)} {...props} />
      {hint && !error && <p id={hintId} className="text-xs text-text-secondary">{hint}</p>}
      {error && <p id={errorId} className="text-xs text-error" role="alert">{error}</p>}
    </div>
  );
}
```
