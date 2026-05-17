# PostPrivacyBadge

- **id:** `social-post-privacy-badge`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/social/post/PostPrivacyBadge.tsx`
- **status:** stable
- **since:** 2026-05

Compact icon (+ optional label) showing post visibility — public, friends only, or private.

## Variants

### Icon + label

```tsx
<PostPrivacyBadge privacy="PUBLIC"  showLabel />
<PostPrivacyBadge privacy="FRIENDS" showLabel />
<PostPrivacyBadge privacy="PRIVATE" showLabel />
```

### Icon only

```tsx
<PostPrivacyBadge privacy="PUBLIC" />
<PostPrivacyBadge privacy="FRIENDS" />
<PostPrivacyBadge privacy="PRIVATE" />
```

## Full source

```tsx
import { PostPrivacyBadge } from '@/modules/domains/social/post/PostPrivacyBadge';
<PostPrivacyBadge privacy="PUBLIC" showLabel />
```
