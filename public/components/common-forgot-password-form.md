# ForgotPasswordForm

- **id:** `common-forgot-password-form`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/common/auth/ForgotPasswordForm.tsx`
- **status:** stable
- **since:** 2025-04

Email input that triggers a password reset link. Shows an inline success state after submission instead of a redirect.

## Variants

### Default

```tsx
<ForgotPasswordForm onSubmit={async (email) => sendResetLink(email)} />
```

### Sent state

```tsx
// After successful onSubmit, form renders a success message automatically
```

## Full source

```tsx
<ForgotPasswordForm onSubmit={async (email) => sendResetLink(email)} />
```
