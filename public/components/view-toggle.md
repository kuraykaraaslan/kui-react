# ViewToggle

- **id:** `view-toggle`
- **layer:** ui
- **category:** Organism
- **filePath:** `modules/ui/ViewToggle.tsx`
- **status:** stable
- **since:** 2026-05

Yatay / dikey görünüm geçiş kontrolü; ikonlu iki durumlu seçici.

## Variants

### Default (EN labels)

```tsx
<ViewToggle value={view} onChange={setView} />
```

### Custom labels

```tsx
<ViewToggle value={view} onChange={setView} labels={{ horizontal: 'Yatay', vertical: 'Dikey' }} />
```

## Full source

```tsx
import { ViewToggle, type ViewOrientation } from '@/modules/ui/ViewToggle';

const [view, setView] = useState<ViewOrientation>('horizontal');

<ViewToggle value={view} onChange={setView} />

// With custom labels
<ViewToggle
  value={view}
  onChange={setView}
  labels={{ horizontal: 'Yatay', vertical: 'Dikey' }}
  ariaLabel="Görünüm seçenekleri"
/>
```
