# TicketCard

- **id:** `ticket-card`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/event/TicketCard.tsx`
- **status:** stable
- **since:** 2025-03

Kesik çizgili ayırıcı ve SVG QR koduyla tam bilet görseli.

## Variants

### Yatay bilet (varsayılan)

```tsx
<TicketCard
  ticket={ticket}
  event={{ title, startAt, venueName, venueCity }}
  section={{ sectionName: 'Genel Giriş' }}
/>
```

### Dikey bilet

```tsx
<TicketCard
  ticket={ticket}
  event={{ title, startAt, venueName, venueCity }}
  section={{ sectionName: 'Genel Giriş', seatLabel: 'B-14' }}
  orientation="vertical"
  className="w-72"
/>
```

### İptal bilet (dikey)

```tsx
<TicketCard
  ticket={{ ...ticket, status: 'CANCELLED' }}
  event={{ title, startAt, venueName, venueCity }}
  orientation="vertical"
  className="w-72"
/>
```

## Full source

```tsx
import { TicketCard } from '@/modules/domains/event/TicketCard';
<TicketCard
  ticket={ticket}
  event={{ title, startAt, venueName, venueCity }}
  section={{ sectionName: 'Genel Giriş' }}
/>
```
