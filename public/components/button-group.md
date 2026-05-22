# ButtonGroup

- **id:** `button-group`
- **layer:** ui
- **category:** Molecule
- **filePath:** `modules/ui/ButtonGroup.tsx`
- **status:** stable
- **since:** 2025-01

Segmented button group for mutually-exclusive options. Supports 4 variants, 4 sizes and disabled items.

## Design tokens consumed

- `--border`
- `--surface-base`
- `--surface-overlay`

## Variants

### Outline (default)

```tsx
function Demo() {
  const [v, setV] = useState('week');
  return (
    <ButtonGroup value={v} onChange={setV}
      items={[{ value: 'day', label: 'Day' }, { value: 'week', label: 'Week' }, { value: 'month', label: 'Month' }]}
    />
  );
}
```

### Sizes

```tsx
<ButtonGroup size="sm" value="a" onChange={setV} items={[...]} />
<ButtonGroup size="md" value="a" onChange={setV} items={[...]} />
```

### Primary / secondary / ghost

```tsx
<ButtonGroup variant="primary" value="week" onChange={setV} items={[...]} />
<ButtonGroup variant="secondary" value="week" onChange={setV} items={[...]} />
<ButtonGroup variant="ghost" value="week" onChange={setV} items={[...]} />
```

### With disabled item

```tsx
<ButtonGroup value="week" onChange={setV}
  items={[
    { value: 'day',   label: 'Day' },
    { value: 'week',  label: 'Week' },
    { value: 'month', label: 'Month', disabled: true },
  ]}
/>
```

### Icon-style labels

```tsx
// Use single-char labels as icon proxies:
<ButtonGroup value="grid" onChange={setV}
  items={[
    { value: 'list', label: '☰' },
    { value: 'grid', label: '⊞' },
    { value: 'map',  label: '◫' },
  ]}
/>
```

## Full source

```tsx
'use client';
import { cn } from '@/libs/utils/cn';

export function ButtonGroup({ items, value, onChange, variant = 'outline', size = 'md' }) {
  return (
    <div role="group" className="inline-flex rounded-md overflow-hidden border border-border divide-x divide-border">
      {items.map((item) => (
        <button key={item.value} type="button" aria-pressed={item.value === value}
          onClick={() => onChange(item.value)}
          className={cn('px-4 py-2 text-sm font-medium transition-colors', item.value === value ? 'bg-surface-overlay font-semibold' : 'bg-surface-base hover:bg-surface-overlay')}>
          {item.label}
        </button>
      ))}
    </div>
  );
}
```
