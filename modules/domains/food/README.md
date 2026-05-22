# modules/domains/food

Food delivery / restaurant domain — restaurant cards, menu items, cuisine filters, and order/delivery tracking components.

## Subdirectories

```
cuisine/
menu/
order/
restaurant/
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
6. Address/Money types reused from `@/modules/domains/common`.

See [/AGENTS.md](../../../AGENTS.md).
