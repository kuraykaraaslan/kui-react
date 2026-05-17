# OAuthButtons

- **id:** `common-oauth-buttons`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/common/auth/OAuthButtons.tsx`
- **status:** stable
- **since:** 2025-03

Social sign-in buttons for Google, GitHub, Discord, and Microsoft. Accepts a providers prop to show only a subset.

## Variants

### All providers

```tsx
<OAuthButtons onProvider={handleOAuth} />
```

### Selected providers

```tsx
<OAuthButtons providers={['GOOGLE', 'GITHUB']} onProvider={handleOAuth} />
```

## Full source

```tsx
'use client';
import { OAuthButtons } from '@/modules/domains/common/auth/OAuthButtons';

// All providers
<OAuthButtons onProvider={(provider) => signInWithOAuth(provider)} />

// Selected providers
<OAuthButtons providers={['GOOGLE', 'GITHUB']} onProvider={handleOAuth} />
```
