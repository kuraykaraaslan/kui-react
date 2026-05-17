# ChangePasswordForm

- **id:** `common-change-password-form`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/common/auth/ChangePasswordForm.tsx`
- **status:** stable
- **since:** 2025-04

Current password + new password + confirm fields with match validation and server-error banner.

## Variants

### Default

```tsx
<ChangePasswordForm onSubmit={handleSubmit} />
```

### Server error

```tsx
<ChangePasswordForm onSubmit={handleSubmit} error="Current password is incorrect." />
```

## Full source

```tsx
'use client';
import { ChangePasswordForm } from '@/modules/domains/common/auth/ChangePasswordForm';

<ChangePasswordForm
  onSubmit={async ({ currentPassword, newPassword }) => {
    await updatePassword(currentPassword, newPassword);
  }}
  error={serverError}
/>
```
