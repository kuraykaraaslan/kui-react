# SkipLink + LiveRegion

- **id:** `skip-link`
- **layer:** ui
- **category:** Atom
- **filePath:** `modules/ui/SkipLink.tsx`
- **status:** stable
- **since:** 2025-01

SkipLink is visually hidden until focused, enabling keyboard users to bypass navigation. LiveRegion announces dynamic content to screen readers.

## Variants

### SkipLink (focus to reveal)

```tsx
// Place at top of layout:
<SkipLink href="#main-content" />

// Linked target:
<main id="main-content">...</main>
```

### LiveRegion

```tsx
function Demo() {
  const [msg, setMsg] = useState('');
  return (
    <>
      <button onClick={() => setMsg('Action completed')}>Act</button>
      <LiveRegion message={msg} />
    </>
  );
}
```

## Full source

```tsx
'use client';
import { cn } from '@/libs/utils/cn';

export function SkipLink({ href = '#main-content', label = 'Skip to main content' }) {}
export function LiveRegion({ message, politeness = 'polite' }) {}
```
