# GlobalSearch

- **id:** `global-search`
- **layer:** app
- **category:** App
- **filePath:** `modules/app/GlobalSearch.tsx`
- **status:** stable
- **since:** 2025-04

Command-palette-style global search field. Supports a categorised result list, keyboard navigation and result selection.

## Variants

### Interactive results

```tsx
<GlobalSearch
  placeholder="Search pages and actions…"
  results={results}
  onSearch={handleSearch}
  onSelect={(result) => setSelected(result.label)}
/>
```

### Loading state

```tsx
<GlobalSearch loading results={results} onSearch={handleSearch} onSelect={handleSelect} />
```

## Full source

```tsx
'use client';
import { GlobalSearch } from '@/modules/app/GlobalSearch';

export function Demo() {
  return (
    <GlobalSearch
      placeholder="Search…"
      results={results}
      onSearch={handleSearch}
      onSelect={handleSelect}
    />
  );
}
```
