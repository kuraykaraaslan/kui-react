# EventCard

- **id:** `event-card`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/event/EventCard.tsx`
- **status:** stable
- **since:** 2025-03

16:9 görsel, fiyat pill, kategori/durum/format badge ve organizatör bilgisi içeren tam etkinlik kartı.

## Variants

### Yayında

```tsx
<EventCard event={event} />
```

### Satışı Bitti

```tsx
<EventCard event={soldOutEvent} />
```

## Full source

```tsx
import { EventCard } from '@/modules/domains/event/EventCard';
<EventCard event={event} />
```
