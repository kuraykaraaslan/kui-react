# SocialProfileCard

- **id:** `social-profile-card`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/social/profile/SocialProfileCard.tsx`
- **status:** stable
- **since:** 2026-05

User profile card with cover image, avatar, bio, location, website, follower / following stats, and follow / message actions.

## Variants

### Full profile — other user

```tsx
<SocialProfileCard user={{
  userId: 'user-01',
  name: 'Lena Fischer',
  username: 'lena_design',
  bio: 'Product designer & creative coder.',
  location: 'Berlin, Germany',
  website: 'https://lena.design',
  followerCount: 12400, followingCount: 320, postCount: 284,
  isVerified: true, isFollowing: false,
}} />
```

### Own profile (edit button)

```tsx
<SocialProfileCard user={user} isOwnProfile />
```

## Full source

```tsx
import { SocialProfileCard } from '@/modules/domains/social/profile/SocialProfileCard';
<SocialProfileCard user={user} />
```
