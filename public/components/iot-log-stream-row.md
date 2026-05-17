# LogStreamRow

- **id:** `iot-log-stream-row`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/iot/telemetry/LogStreamRow.tsx`
- **status:** stable
- **since:** 2026-05

Monospace log entry: timestamp, level tag (DBG/INF/WRN/ERR/FTL), source, and message body.

## Variants

### All five levels

```tsx
<LogStreamRow timestamp={date} level="warn" source="..." message="..." />
```

## Full source

```tsx
import { LogStreamRow } from '@/modules/domains/iot/telemetry/LogStreamRow';
<LogStreamRow timestamp={date} level="info" source="mqtt.client" message="..." />
```
