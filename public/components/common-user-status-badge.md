# UserStatusBadge

- **id:** `common-user-status-badge`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/common/user/UserStatusBadge.tsx`
- **status:** stable
- **since:** 2025-03

Color-coded badge for ACTIVE / INACTIVE / BANNED user statuses. Optional dot prop adds a leading status indicator.

## Variants

### All statuses

```tsx
<UserStatusBadge status="ACTIVE" />
<UserStatusBadge status="INACTIVE" />
<UserStatusBadge status="BANNED" />
```

### With dot

```tsx
<UserStatusBadge status="ACTIVE" dot />
<UserStatusBadge status="INACTIVE" dot />
<UserStatusBadge status="BANNED" dot />
```

## Full source

```tsx
'use client';
import { UserStatusBadge } from '@/modules/domains/common/user/UserStatusBadge';

<UserStatusBadge status="ACTIVE" />
<UserStatusBadge status="BANNED" dot />
```
