# AlertSeverityBadge

- **id:** `iot-alert-severity-badge`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/iot/alert/AlertSeverityBadge.tsx`
- **status:** stable
- **since:** 2026-05

Alert severity indicator — Info, Warning, or Critical.

## Variants

### All severities

```tsx
<AlertSeverityBadge severity="INFO" />
<AlertSeverityBadge severity="WARNING" />
<AlertSeverityBadge severity="CRITICAL" />
```

### Small

```tsx
<AlertSeverityBadge severity="WARNING" size="sm" />
<AlertSeverityBadge severity="CRITICAL" size="sm" />
```

## Full source

```tsx
'use client';
import { Badge } from '@/modules/ui/Badge';
import type { AlertSeverity } from '../types';

export function AlertSeverityBadge({ severity, size = 'md', className }) {
  // ...
}
```
