# modules/domains/fintech

Fintech / banking domain — wallets, cards, transactions, FX, crypto, and portfolio charting components.

## Subdirectories

```
card/
chart/
crypto/
fx/
portfolio/
transaction/
wallet/
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
6. Money/Currency types reused from `@/modules/domains/common`.

See [/AGENTS.md](../../../AGENTS.md).
