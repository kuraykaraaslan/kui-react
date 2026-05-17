# TicketRowMeta + TicketRowActions

- **id:** `event-ticket-row-meta`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/event/TicketRowMeta.tsx`
- **status:** stable
- **since:** 2026-05

Bilet listesi satırı başlığı: etkinlik küçük resmi, durum rozeti (TicketRowMeta) ve yazdır / paylaş butonları (TicketRowActions).

## Variants

### Default

```tsx
<div className="flex items-center justify-between px-1">
  <TicketRowMeta   entry={entry} />
  <TicketRowActions entry={entry} />
</div>
```

### Compact (vertical layout)

```tsx
<TicketRowMeta   entry={entry} compact />
<TicketRowActions entry={entry} compact />
```

## Full source

```tsx
import { TicketRowMeta, TicketRowActions } from '@/modules/domains/event/TicketRowMeta';

const entry = {
  event:  { image: '/img/event.jpg', title: 'Rock Festival 2026' },
  ticket: { ticketId: 'TK-001', status: 'VALID' },
};

<div className="flex items-center justify-between px-1">
  <TicketRowMeta   entry={entry} />
  <TicketRowActions entry={entry} />
</div>
```
