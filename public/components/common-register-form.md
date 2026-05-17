# RegisterForm

- **id:** `common-register-form`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/common/auth/RegisterForm.tsx`
- **status:** stable
- **since:** 2025-03

Registration form with email, password, and confirm-password fields. Real-time password match validation and server-error support.

## Variants

### Default

```tsx
<RegisterForm onSubmit={handleRegister} />
```

### Server error

```tsx
<RegisterForm onSubmit={handleRegister} error="This email is already in use." />
```

## Full source

```tsx
'use client';
import { RegisterForm } from '@/modules/domains/common/auth/RegisterForm';

<RegisterForm
  onSubmit={async ({ email, password }) => {
    await register(email, password);
  }}
/>
```
