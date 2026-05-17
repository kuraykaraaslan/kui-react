# CloudWorkspaceCard

- **id:** `iot-cloud-workspace-card`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/iot/workspace/CloudWorkspaceCard.tsx`
- **status:** stable
- **since:** 2026-05

Cloud workspace overview card — status, plan, device counts with online progress bar.

## Variants

### Active workspace

```tsx
<CloudWorkspaceCard workspace={workspace} />
```

### Suspended workspace

```tsx
<CloudWorkspaceCard workspace={suspendedWorkspace} />
```

## Full source

```tsx
'use client';
import { cn } from '@/libs/utils/cn';
import { Badge } from '@/modules/ui/Badge';
import type { CloudWorkspace } from '../types';

export function CloudWorkspaceCard({ workspace, className, onClick }) {
  // ...
}
```
