# modules/domains/real-estate

Real estate listings domain — property cards, agent profiles, mortgage calculator, and saved-search components.

## Subdirectories

```
agent/
listing/
mortgage/
property/
saved/
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
6. Address/Location/Money types reused from `@/modules/domains/common`; map UI via `@/modules/ui/MapView`.

See [/AGENTS.md](../../../AGENTS.md).
