# FilterBar

- **id:** `filter-bar`
- **layer:** app
- **category:** App
- **filePath:** `modules/app/FilterBar.tsx`
- **status:** stable
- **since:** 2025-03

Select, multiselect, daterange and text-based filter panel. Supports URL-based filtering via GET form submit.

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
