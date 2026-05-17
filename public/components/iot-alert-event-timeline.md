# AlertEventTimeline

- **id:** `iot-alert-event-timeline`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/iot/alert/AlertEventTimeline.tsx`
- **status:** stable
- **since:** 2026-05

Chronological event log for an alert: opened → acknowledged → resolved, with operator notes.

## Variants

### Five event kinds

```tsx
<AlertEventTimeline events={[{ kind: 'opened', ... }, { kind: 'resolved', ... }]} />
```

## Full source

```tsx
import { AlertEventTimeline } from '@/modules/domains/iot/alert/AlertEventTimeline';
<AlertEventTimeline events={[{ eventId, kind: 'opened', by, at, note }]} />
```
