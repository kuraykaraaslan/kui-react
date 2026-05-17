# DeviceStatusBadge

- **id:** `iot-device-status-badge`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/iot/device/DeviceStatusBadge.tsx`
- **status:** stable
- **since:** 2026-05

Displays device connectivity state — Online, Offline, Error, or Maintenance.

## Variants

### All states

```tsx
<DeviceStatusBadge status="ONLINE" />
<DeviceStatusBadge status="OFFLINE" />
<DeviceStatusBadge status="ERROR" />
<DeviceStatusBadge status="MAINTENANCE" />
```

### Small size

```tsx
<DeviceStatusBadge status="ONLINE" size="sm" />
<DeviceStatusBadge status="ERROR" size="sm" />
```

## Full source

```tsx
'use client';
import { Badge } from '@/modules/ui/Badge';
import type { DeviceStatus } from '../types';

export function DeviceStatusBadge({ status, size = 'md', className }) {
  // ...
}
```
