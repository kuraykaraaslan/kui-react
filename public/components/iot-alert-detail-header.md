# AlertDetailHeader

- **id:** `iot-alert-detail-header`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/iot/alert/AlertDetailHeader.tsx`
- **status:** stable
- **since:** 2026-05

Header for an alert detail page: severity + status badges, device link, opened timestamp, action buttons.

## Variants

### Critical / open

```tsx
<AlertDetailHeader title="…" severity="CRITICAL" status="OPEN" deviceName="…" openedAt={date} />
```

### Warning / acknowledged

```tsx
<AlertDetailHeader severity="WARNING" status="ACKNOWLEDGED" />
```

## Full source

```tsx
import { AlertDetailHeader } from '@/modules/domains/iot/alert/AlertDetailHeader';
<AlertDetailHeader title="..." severity="CRITICAL" status="OPEN" deviceName="..." openedAt={date} onAcknowledge={...} />
```
