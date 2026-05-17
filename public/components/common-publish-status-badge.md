# PublishStatusBadge

- **id:** `common-publish-status-badge`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/common/status/PublishStatusBadge.tsx`
- **status:** stable
- **since:** 2025-03

Badge for DRAFT / PUBLISHED / ARCHIVED content states with contextual Font Awesome icons. Icon can be hidden via showIcon={false}.

## Variants

### All statuses

```tsx
<PublishStatusBadge status="DRAFT" />
<PublishStatusBadge status="PUBLISHED" />
<PublishStatusBadge status="ARCHIVED" />
```

### Without icon, small

```tsx
<PublishStatusBadge status="DRAFT" showIcon={false} size="sm" />
<PublishStatusBadge status="PUBLISHED" showIcon={false} size="sm" />
```

## Full source

```tsx
'use client';
import { PublishStatusBadge } from '@/modules/domains/common/status/PublishStatusBadge';

<PublishStatusBadge status="PUBLISHED" />
<PublishStatusBadge status="DRAFT" showIcon={false} size="sm" />
```
