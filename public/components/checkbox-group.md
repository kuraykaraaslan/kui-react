# CheckboxGroup

- **id:** `checkbox-group`
- **layer:** ui
- **category:** Molecule
- **filePath:** `modules/ui/CheckboxGroup.tsx`
- **status:** stable
- **since:** 2025-02

Chip-style multi-select group. Selected chips use bg-primary-subtle / border-primary tokens. Keyboard accessible.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--error`
- `--primary`
- `--primary-subtle`
- `--surface-base`
- `--surface-overlay`
- `--text-primary`

## Variants

### Default

```tsx
const [selected, setSelected] = useState(['react', 'typescript']);
<CheckboxGroup
  legend="Tech stack"
  options={[
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'typescript', label: 'TypeScript' },
  ]}
  selected={selected}
  onChange={setSelected}
/>
```

### Disabled

```tsx
<CheckboxGroup
  legend="Permissions"
  options={[
    { value: 'read', label: 'Read' },
    { value: 'write', label: 'Write' },
    { value: 'delete', label: 'Delete' },
  ]}
  selected={['read']}
  onChange={() => {}}
  disabled
/>
```

## Full source

```tsx
'use client';
import { cn } from '@/libs/utils/cn';

export function CheckboxGroup({ legend, options, selected, onChange, disabled, error, className }) {
  function toggle(opt, checked) {
    onChange(checked ? [...selected, opt] : selected.filter((s) => s !== opt));
  }
  return (
    <fieldset className={cn('space-y-2', className)}>
      <legend className="text-sm font-medium text-text-primary mb-2">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isSelected = selected.includes(opt);
          return (
            <label key={opt} className={cn('flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm transition-colors focus-within:ring-2 focus-within:ring-border-focus', disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer', isSelected ? 'bg-primary-subtle border-primary text-primary' : 'bg-surface-base border-border text-text-primary hover:bg-surface-overlay')}>
              <input type="checkbox" checked={isSelected} disabled={disabled} onChange={(e) => toggle(opt, e.target.checked)} className="sr-only" />
              {isSelected && <span aria-hidden="true" className="text-xs font-bold">✓</span>}
              <span>{opt}</span>
            </label>
          );
        })}
      </div>
      {error && <p className="text-xs text-error mt-1" role="alert">{error}</p>}
    </fieldset>
  );
}
```
