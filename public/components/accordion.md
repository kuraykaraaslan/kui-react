# Accordion

- **id:** `accordion`
- **layer:** ui
- **category:** Molecule
- **filePath:** `modules/ui/Accordion.tsx`
- **status:** stable
- **since:** 2026-09

Vertically stacked, collapsible content panels. Single-open by default, or `allowMultiple` for independent panels. Fully keyboard accessible via native `<button>` disclosure headers.

## Accessibility

- WCAG: AA
- ARIA patterns: disclosure (accordion)
- Keyboard:
  - `Tab` — Move focus between panel headers
  - `Enter / Space` — Toggle the focused panel

## Variants

### Single open (default)

```tsx
<Accordion
  items={[
    { id: 'shipping', title: 'Shipping', content: '...' },
    { id: 'returns', title: 'Returns', content: '...' },
    { id: 'warranty', title: 'Warranty', content: '...', disabled: true },
  ]}
  defaultOpenIds={['shipping']}
/>
```

### Allow multiple open

```tsx
<Accordion
  allowMultiple
  items={[{ id: 'a', title: 'Section A', content: '...' }, { id: 'b', title: 'Section B', content: '...' }]}
  defaultOpenIds={['a', 'b']}
/>
```

## Full source

```tsx
'use client';
import { Accordion } from '@/modules/ui/Accordion';

<Accordion
  items={[
    { id: 'shipping', title: 'Shipping', content: '...' },
    { id: 'returns', title: 'Returns', content: '...' },
  ]}
  defaultOpenIds={['shipping']}
/>
```
