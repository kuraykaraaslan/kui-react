# FilterBar

- **id:** `filter-bar`
- **layer:** app
- **category:** App
- **filePath:** `modules/app/FilterBar.tsx`
- **status:** stable
- **since:** 2025-03

Liste ve dashboard ekranları için select, multiselect, daterange ve tag tabanlı filtre paneli.

## Variants

### Full filter set

```tsx
<FilterBar fields={fields} values={values} onChange={handleChange} onApply={handleApply} onReset={handleReset} />
```

### Compact filters

```tsx
<FilterBar fields={fields.slice(0, 2)} values={values} onChange={handleChange} />
```

## Full source

```tsx
'use client';
import { FilterBar } from '@/modules/app/FilterBar';

export function Demo() {
  return (
    <FilterBar
      fields={fields}
      values={values}
      onChange={handleChange}
      onApply={handleApply}
      onReset={handleReset}
    />
  );
}
```
