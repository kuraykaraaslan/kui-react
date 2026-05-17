# TeamMemberCard

- **id:** `landing-team-member-card`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/landing/team/TeamMemberCard.tsx`
- **status:** stable
- **since:** 2026-05

Centered team card showing avatar (or initials fallback), name, role, optional bio, and social link icons for LinkedIn, X (Twitter), and GitHub.

## Variants

### Two cards

```tsx
<TeamMemberCard member={member} />
```

### Four-column grid

```tsx
{team.map((m) => <TeamMemberCard key={m.memberId} member={m} />)}
```

## Full source

```tsx
'use client';
import { TeamMemberCard } from '@/modules/domains/landing/team/TeamMemberCard';

<TeamMemberCard member={{
  memberId: 'm1',
  name: 'Elena Markov',
  role: 'CEO & Co-founder',
  bio: 'Ex-Vercel, ex-Stripe.',
  socialLinks: [
    { platform: 'twitter',  url: 'https://x.com/elena' },
    { platform: 'linkedin', url: 'https://linkedin.com/in/elena' },
  ],
}} />
```
