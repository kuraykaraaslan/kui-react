# AdvancedDataTable

- **id:** `advanced-data-table`
- **layer:** ui
- **category:** Organism
- **filePath:** `modules/ui/AdvancedDataTable.tsx`
- **status:** beta
- **since:** 2025-03

Enhanced table with row selection (with indeterminate header), expandable rows, and optional sticky header.

## Variants

### Selectable + Expandable

```tsx
<AdvancedDataTable
  columns={[{ key: 'name', header: 'Name' }, ...]}
  rows={rows}
  selectable
/>
```

### Sticky Header

```tsx
<AdvancedDataTable columns={columns} rows={rows} stickyHeader />
```

## Full source

```tsx
'use client';
import { cn } from '@/libs/utils/cn';
import { useState } from 'react';

export function AdvancedDataTable({ columns, rows, selectable, stickyHeader, onSelectionChange }) {
  // row selection with indeterminate header, expandable rows, sticky header
}
```
