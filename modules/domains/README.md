# modules/domains

Industry-vertical components. Each subdirectory composes `modules/ui/` + `modules/app/` into real-world domain workflows. Every vertical has its own `index.ts` barrel and `types.ts` Zod schemas. Import via barrel: `import { ProductCard } from '@/modules/domains/commerce'`.

## Verticals

```
ai/
api-doc/
blog/
commerce/
common/
event/
fintech/
food/
forum/
iot/
jobs/
landing/
media/
nft/
real-estate/
reviews/
social/
travel/
index.ts
```

## Parity

| Vertical | EJS counterpart |
|----------|-----------------|
| `common/` | `/home/kuray/02_EJS_Components/modules/domain/common/` |
| `api-doc/` | `/home/kuray/02_EJS_Components/modules/domain/api-doc/` |
| all others | NextJS-only, no EJS counterpart |

EJS extras (`invoice`, `modem`, `ups`) have no NextJS counterpart yet.

## Conventions

1. `'use client';` at top of every component file.
2. `cn()` from `@/libs/utils/cn`.
3. Named exports only.
4. Shared Tailwind tokens from `app/globals.css`.
5. Icons via `<FontAwesomeIcon>`.
6. Types live in `<vertical>/types.ts` as Zod schemas + inferred TS types.
7. Each vertical re-exports its public surface through `index.ts`.

See [/AGENTS.md](../../AGENTS.md) for the canonical authoring + parity contract.
