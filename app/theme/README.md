# app/theme

Full-page theme demos. Each subdirectory is a self-contained Next.js route subtree that wires domain components from `modules/domains/<vertical>/` into a realistic multi-page product experience.

## Themes

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
social/
travel/
```

## Parity

| Theme | EJS counterpart |
|-------|-----------------|
| `common/` | `/home/kuray/02_EJS_Components/views/theme/common/` |
| `api-doc/` | `/home/kuray/02_EJS_Components/views/theme/api-doc/` |
| all others | NextJS-only, no EJS counterpart |

EJS extras (`invoice`, `modem`, `ups`) have no NextJS theme yet.

## Conventions

1. `layout.tsx` is a Client Component (`'use client'`) — owns interactive shell state.
2. `page.tsx` is a Server Component by default; only mark `'use client'` when the page itself manages state.
3. Sample data lives in `<vertical>.data.ts` files — components receive data as props.
4. Compose from `modules/domains/<vertical>/` + `modules/ui/`; do not duplicate domain components.
5. Dynamic routes use `generateStaticParams`.
6. `<main id="main-content">` required in `layout.tsx` for skip-link a11y.
7. `cn()` from `@/libs/utils/cn`; tokens from `app/globals.css`; icons via `<FontAwesomeIcon>`.

See [/AGENTS.md](../../AGENTS.md) for the full theme contract.
