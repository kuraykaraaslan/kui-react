# UserProfileForm

- **id:** `common-user-profile-form`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/common/user/UserProfileForm.tsx`
- **status:** stable
- **since:** 2025-04

Controlled form for editing display name, username, bio, and profile picture URL. Username validation: 3–32 chars, lowercase alphanumeric + underscore.

## Variants

### Empty

```tsx
<UserProfileForm onSubmit={handleSave} />
```

### Pre-filled

```tsx
<UserProfileForm initial={{ name: 'Jane Doe', username: 'janedoe', biography: '...' }} onSubmit={handleSave} />
```

## Full source

```tsx
'use client';
import { UserProfileForm } from '@/modules/domains/common/user/UserProfileForm';

<UserProfileForm
  initial={{ name: 'Jane Doe', username: 'janedoe' }}
  onSubmit={async (values) => saveProfile(values)}
/>
```
