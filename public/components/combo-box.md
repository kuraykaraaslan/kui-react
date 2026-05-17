# ComboBox

- **id:** `combo-box`
- **layer:** ui
- **category:** Molecule
- **filePath:** `modules/ui/ComboBox.tsx`
- **status:** beta
- **since:** 2025-03

Single-select combobox with type-to-filter behavior, keyboard navigation, and optional async search.

## Variants

### Controlled selection

```tsx
function Demo() {
  const [value, setValue] = useState('nextjs');
  return (
    <ComboBox
      id="framework"
      label="Framework"
      options={COMBO_OPTIONS}
      value={value}
      onChange={setValue}
    />
  );
}
```

### Async search

```tsx
<ComboBox id="search" label="Async search" options={COMBO_OPTIONS} onSearch={search} value={value} onChange={setValue} />
```

## Full source

```tsx
'use client';
import { cn } from '@/libs/utils/cn';
import { useState } from 'react';

export function ComboBox({ id, label, options, value, onChange, onSearch }) {
  // searchable single-select combobox with async search support
}
```
