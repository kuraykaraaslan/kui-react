# DeviceTypeBadge

- **id:** `iot-device-type-badge`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/iot/device/DeviceTypeBadge.tsx`
- **status:** stable
- **since:** 2026-05

Indicates device origin — Internal first-party hardware, third-party Integration, or External feed.

## Variants

### All types

```tsx
<DeviceTypeBadge type="INTERNAL" />
<DeviceTypeBadge type="INTEGRATION" />
<DeviceTypeBadge type="EXTERNAL" />
```

### Small size

```tsx
<DeviceTypeBadge type="INTERNAL" size="sm" />
<DeviceTypeBadge type="INTEGRATION" size="sm" />
```

## Full source

```tsx
'use client';
import { Badge } from '@/modules/ui/Badge';
import type { DeviceType } from '../types';

export function DeviceTypeBadge({ type, size = 'md', className }) {
  // ...
}
```
