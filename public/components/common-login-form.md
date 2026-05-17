# LoginForm

- **id:** `common-login-form`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/common/auth/LoginForm.tsx`
- **status:** stable
- **since:** 2025-03

Email + password sign-in form with inline validation, "Remember me" checkbox, and server-error banner.

## Variants

### Default

```tsx
<LoginForm onSubmit={handleLogin} />
```

### Server error

```tsx
<LoginForm onSubmit={handleLogin} error="Invalid email or password." />
```

## Full source

```tsx
'use client';
import { LoginForm } from '@/modules/domains/common/auth/LoginForm';

<LoginForm
  onSubmit={async ({ email, password, rememberMe }) => {
    await signIn(email, password);
  }}
  error="Invalid email or password."
/>
```
