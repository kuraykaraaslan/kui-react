# modules/domains/ai

AI workspace domain — model catalog, chat, fine-tuning jobs, and usage telemetry components.

## Subdirectories

```
chat/
compare/
job/
model/
usage/
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
6. Zod schemas in `types.ts`; each subdirectory re-exports through the root `index.ts`.

See [/AGENTS.md](../../../AGENTS.md).
