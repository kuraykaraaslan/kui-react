# StatCard

- **id:** `stat-card`
- **layer:** ui
- **category:** Organism
- **filePath:** `modules/ui/StatCard.tsx`
- **status:** stable
- **since:** 2026-05

Küçük metrik gösterim kartı; değer, etiket ve opsiyonel vurgu rengi.

## Design tokens consumed

- `--error`
- `--success`

## Variants

### Variants

```tsx
<StatCard label="Total Users" value={1284} />
<StatCard label="Active"      value={947}  accent="text-success" />
<StatCard label="Transferred" value={38}   accent="text-info" />
<StatCard label="Cancelled"   value={12}   accent="text-error" />
```

## Full source

```tsx
import { StatCard } from '@/modules/ui/StatCard';

<StatCard label="Total Users" value={1284} />
<StatCard label="Active"      value={947}  accent="text-success" />
<StatCard label="Cancelled"   value={12}   accent="text-error" />
```
