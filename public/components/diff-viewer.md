# DiffViewer

- **id:** `diff-viewer`
- **layer:** ui
- **category:** Molecule
- **filePath:** `modules/ui/DiffViewer/index.tsx`
- **status:** stable
- **since:** 2026-05

Line-based text diff viewer with unified (GitHub-style) and split (yan yana) modes. M1 ships a zero-dep LCS algorithm, hunk headers in `@@ -old,n +new,n @@` form, old/new line-number gutters, configurable context window, and optional collapsible unchanged regions. Pixel-identical EJS sibling at modules/ui/DiffViewer/DiffViewer.ejs.

## Accessibility

- WCAG: AA
- ARIA patterns: region, separator
- Keyboard:
  - `Tab` — Move focus into the diff region
  - `Enter` — Expand a collapsed unchanged run (when collapsible=true)

TODO M5: J/K next/prev change, N/P next/prev file, full roving tabindex + screen-reader line announcements.

## Design tokens consumed

- `--surface-base`
- `--surface-overlay`
- `--surface-sunken`
- `--text-primary`
- `--text-secondary`
- `--text-disabled`
- `--border`
- `--border-focus`
- `--success`
- `--success-subtle`
- `--error`
- `--error-subtle`

## Variants

### Unified (default)

```tsx
<DiffViewer oldText={oldSrc} newText={newSrc} />
```

### Split (yan yana)

```tsx
<DiffViewer oldText={oldSrc} newText={newSrc} mode="split" />
```

### With context=1

```tsx
<DiffViewer oldText={oldSrc} newText={newSrc} context={1} />
```

### Collapsible unchanged context

```tsx
<DiffViewer
  oldText={oldSrc}
  newText={newSrc}
  context={3}
  collapsible
/>
```

## Full source

```tsx
'use client';
import { DiffViewer } from '@/modules/ui/DiffViewer';

// Unified (default) — GitHub-style single column.
<DiffViewer oldText={oldSrc} newText={newSrc} />

// Split — yan yana, scroll-synced.
<DiffViewer oldText={oldSrc} newText={newSrc} mode="split" />

// Custom context window + collapsible unchanged regions.
<DiffViewer
  oldText={oldSrc}
  newText={newSrc}
  context={2}
  collapsible
/>

// Language hint — applied as a data-language attribute today; the M2
// syntax-highlight engine will pick it up automatically.
<DiffViewer oldText={oldSrc} newText={newSrc} language="ts" />
```
