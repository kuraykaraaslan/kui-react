# SessionExpiredBanner

- **id:** `common-session-expired-banner`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/common/auth/SessionExpiredBanner.tsx`
- **status:** stable
- **since:** 2025-04

Warning banner shown when the user session has expired. Includes a "Sign in again" action button.

## Variants

### With action

```tsx
<SessionExpiredBanner onSignIn={() => router.push('/login')} />
```

### Custom message

```tsx
<SessionExpiredBanner message="You've been signed out due to inactivity." onSignIn={handleSignIn} />
```

## Full source

```tsx
<SessionExpiredBanner onSignIn={() => router.push('/login')} />
```
