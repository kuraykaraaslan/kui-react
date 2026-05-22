# app/theme/social

Social network theme demo — profile, friends, messages, notifications, marketplace, and settings pages. Wires `modules/domains/social/`.

## Files

```
friends/
layout.tsx
marketplace/
messages/
notifications/
page.tsx
profile/
settings/
social.data.ts
```

## Parity

NextJS-only, no EJS counterpart.

## Conventions

1. `layout.tsx` is `'use client'`; pages default to Server Components.
2. Sample data in `social.data.ts` — passed in as props.
3. Dynamic profile/conversation routes use `generateStaticParams`.
4. Compose `@/modules/domains/social/` + `@/modules/ui/` + `@/modules/app/`; no in-theme duplicates.
5. `cn()` from `@/libs/utils/cn`; tokens from `app/globals.css`; icons via `<FontAwesomeIcon>`.
6. `<main id="main-content">` in layout for skip-link a11y.

See [/AGENTS.md](../../../AGENTS.md).
