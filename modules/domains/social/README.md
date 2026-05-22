# modules/domains/social

Social network domain — posts, profiles, messaging, notifications, and marketplace listing components.

## Subdirectories

```
marketplace/
message/
notification/
post/
profile/
index.ts
types.ts
```

## Parity

NextJS-only, no EJS counterpart.

## Conventions

1. `'use client';` at top of every component file.
2. `cn()` from `@/libs/utils/cn`.
3. Named exports only.
4. Shared Tailwind tokens from `app/globals.css`.
5. Icons via `<FontAwesomeIcon>`.
6. User/Id types reused from `@/modules/domains/common`.

See [/AGENTS.md](../../../AGENTS.md).
