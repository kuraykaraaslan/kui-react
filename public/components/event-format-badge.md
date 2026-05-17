# EventFormatBadge

- **id:** `event-format-badge`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/event/EventFormatBadge.tsx`
- **status:** stable
- **since:** 2025-03

Etkinlik formatını (PHYSICAL / ONLINE / HYBRID) emoji + etiket ile gösterir.

## Variants

### Tüm formatlar

```tsx
<EventFormatBadge format="PHYSICAL" />
<EventFormatBadge format="ONLINE" />
<EventFormatBadge format="HYBRID" />
```

## Full source

```tsx
import { EventFormatBadge } from '@/modules/domains/event/EventFormatBadge';
<EventFormatBadge format="PHYSICAL" />
```
