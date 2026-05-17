# GlobalSearch

- **id:** `global-search`
- **layer:** app
- **category:** App
- **filePath:** `modules/app/GlobalSearch.tsx`
- **status:** stable
- **since:** 2025-04

Komut paleti benzeri global arama alanı. Kategori bazlı sonuç listesi, klavye navigasyonu ve sonuç seçimi destekler.

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
