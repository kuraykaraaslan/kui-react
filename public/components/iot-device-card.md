# DeviceCard

- **id:** `iot-device-card`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/iot/device/DeviceCard.tsx`
- **status:** stable
- **since:** 2026-05

Compact device summary card showing status, type, location, last-seen time and tags.

## Variants

### Online device

```tsx
<DeviceCard device={device} />
```

### Error + Gateway

```tsx
<DeviceCard device={errorDevice} />
<DeviceCard device={gatewayDevice} />
```

## Full source

```tsx
'use client';
import { cn } from '@/libs/utils/cn';
import { DeviceStatusBadge } from './DeviceStatusBadge';
import { DeviceTypeBadge } from './DeviceTypeBadge';
import type { Device } from '../types';

export function DeviceCard({ device, className, onClick }) {
  // ...
}
```
