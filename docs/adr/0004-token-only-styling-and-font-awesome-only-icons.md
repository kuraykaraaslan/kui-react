# 0004: Token-only styling and Font Awesome-only icons

## Status

Accepted (already implemented as a stated rule; this record documents the reasoning and the enforcement gap).

## Context

`AGENTS.md` states two hard rules for both repos: styling must reference CSS-variable design tokens, never raw hex, and icons must come only from Font Awesome, never inline SVG or another icon package. Both rules exist to keep the four-repo-wide design system (react, ejs, plus any future `kui-native`) visually and legally consistent, and to make theming/white-labeling (swapping `:root` token values) actually work.

Enforcement today is partial: kui-ejs has `scripts/audit-tokens.sh` as a real CI-able check; kui-react has no equivalent script, only the prose rule (`docs/dev/audit-2026-09-15.md` found 40 raw-hex hits in kui-react, most legitimate — palette swatches, Leaflet popup HTML, Chart.js datasets — but unaudited).

## Decision

- Every color value in a component's className or inline style must resolve to a token defined in `app/globals.css` / `styles/index.css` (react) or `public/assets/css/input.css` (ejs), with the token *names* identical across both repos.
- The only permitted raw-hex exceptions are cases where the *rendering context* cannot resolve CSS custom properties: third-party HTML strings (Leaflet popups), canvas-based chart libraries reading colors before paint (Chart.js datasets), and spec-mandated brand colors (OAuth provider buttons, payment card brand gradients). Each exception is allowlisted with a one-line justification, not silently ignored.
- Icons render only through `@fortawesome/react-fontawesome` (react) or the Font Awesome CDN/self-hosted CSS (ejs), named imports only, `aria-hidden="true"` on decorative uses. No inline SVG, no emoji-as-icon, no other icon package.

## Consequences

- kui-react needs its own `scripts/audit-tokens.mjs` (and a spacing-scale audit) mirroring kui-ejs's, wired into CI — tracked in `docs/dev/phase-1-ci-and-gates.md`, section 1.3.
- Once `docs/dev/phase-4-shared-tooling-and-parity.md`'s token package (`@kuraykaraaslan/kui-tokens`) exists, the audit script can check against the package's token list directly instead of a hand-maintained regex allowlist, closing the gap between "rule documented" and "rule enforced".
- Font Awesome version alignment (7 in react, 6.7.2 in ejs) is a related but separate gap, tracked in phase 4.3, because using the same *icon set* is necessary but not sufficient — the same *version* of that set is what parity (ADR 0003) actually requires.
