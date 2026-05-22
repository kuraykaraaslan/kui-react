# app/theme/media

Video / streaming theme demo — videos, channels, playlists, and creator studio pages. Wires `modules/domains/media/`.

## Files

```
channels/
layout.tsx
media.data.ts
page.tsx
playlists/
studio/
videos/
```

## Parity

NextJS-only, no EJS counterpart.

## Conventions

1. `layout.tsx` is `'use client'`; pages default to Server Components.
2. Sample data in `media.data.ts` — passed in as props.
3. Dynamic video/channel/playlist routes use `generateStaticParams`.
4. Playback via `@/modules/ui/VideoPlayer`.
5. Compose `@/modules/domains/media/` + `@/modules/ui/` + `@/modules/app/`; no in-theme duplicates.
6. `cn()` from `@/libs/utils/cn`; tokens from `app/globals.css`; icons via `<FontAwesomeIcon>`.
7. `<main id="main-content">` in layout for skip-link a11y.

See [/AGENTS.md](../../../AGENTS.md).
