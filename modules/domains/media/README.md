# modules/domains/media

Video / streaming media domain — videos, channels, playlists, and creator analytics chart components.

## Subdirectories

```
channel/
chart/
playlist/
video/
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
6. Use `@/modules/ui/VideoPlayer` for playback; do not re-implement `<video>` wrappers.

See [/AGENTS.md](../../../AGENTS.md).
