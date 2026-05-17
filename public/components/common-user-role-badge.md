# UserRoleBadge

- **id:** `common-user-role-badge`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/common/user/UserRoleBadge.tsx`
- **status:** stable
- **since:** 2025-03

Color-coded badge for ADMIN / AUTHOR / USER roles. ADMIN renders as error (red), AUTHOR as primary (blue), USER as neutral.

## Variants

### All roles

```tsx
<UserRoleBadge role="ADMIN" />
<UserRoleBadge role="AUTHOR" />
<UserRoleBadge role="USER" />
```

### Sizes

```tsx
<UserRoleBadge role="ADMIN" size="sm" />
<UserRoleBadge role="ADMIN" size="md" />
<UserRoleBadge role="ADMIN" size="lg" />
```

## Full source

```tsx
'use client';
import { UserRoleBadge } from '@/modules/domains/common/user/UserRoleBadge';

<UserRoleBadge role="ADMIN" />
<UserRoleBadge role="AUTHOR" size="sm" />
```
