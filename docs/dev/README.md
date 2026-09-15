# Developer plan (docs/dev)

Phased improvement plan for the two KUI showcase repositories. It was produced from a code audit on **2026-09-15** and covers both repos, because most gaps are shared and several fixes only make sense if they land in both.

| Repo | Path key | Stack |
|---|---|---|
| kui-react (this repo) | `$KUIREACT_ROOT` | Next.js 16 · React 19 · TypeScript 5 · Tailwind CSS 4 |
| kui-ejs | `$KUIEJS_ROOT` | Express 4 · EJS 3 · TypeScript 5 · Tailwind CSS 4 |

Path keys resolve through `internal-ai-rules/LOCAL_PATHS.json`. Never hardcode absolute paths in these docs; the audit found five stale absolute paths in the repos already (see phase 0).

## How to use this folder

1. Read [audit-2026-09-15.md](audit-2026-09-15.md) first. It is the baseline: what was measured, how, and the raw numbers every phase refers to.
2. Work through the phases in order. Each phase lists its dependencies. A later phase never requires an earlier one to be 100 % done, but it assumes the earlier phase's *gates* (CI jobs, scripts) exist.
3. Tick a checkbox only when the task is merged on `main`. Append the short commit hash after the task text.
4. When a number quoted in a phase changes, re-run the command from the audit file and update both places. Do not edit numbers from memory.
5. If a task turns out to be wrong or unnecessary, strike it through and add one line saying why. Do not delete it; the reasoning is useful later.

## Phases

| # | File | Goal | Effort | Depends on |
|---|---|---|---|---|
| 0 | [phase-0-hygiene.md](phase-0-hygiene.md) | Zero-risk cleanups: stale paths, package metadata, gitignore, dependency placement, doc drift, repo hygiene files | S | none |
| 1 | [phase-1-ci-and-gates.md](phase-1-ci-and-gates.md) | CI on both repos, registry snapshot drift check, convention lint rules, debt thresholds, pre-commit hooks | M | 0 |
| 2 | [phase-2-testing.md](phase-2-testing.md) | Unit tests, route smoke tests, visual regression, automated a11y, registry consistency tests | M–L | 1 |
| 3 | [phase-3-release-and-package.md](phase-3-release-and-package.md) | Honest npm story: publish or retract, exports map, peer dependencies, build output, release tooling | M | 1 |
| 4 | [phase-4-shared-tooling-and-parity.md](phase-4-shared-tooling-and-parity.md) | One tooling package, one design-token source, generated parity matrix and editor-rule mirrors, version alignment | L | 1, 3 |
| 5 | [phase-5-ejs-security-and-runtime.md](phase-5-ejs-security-and-runtime.md) | CSP, CSRF, inline-script extraction, error pages, Express 5, caching, asset pipeline, static deploy for kui-ejs | M–L | 0, 1 |
| 6 | [phase-6-architecture-refactors.md](phase-6-architecture-refactors.md) | Source-of-truth fixes, browser-free snapshot, form system, standalone-package dedupe, Next.js app-level files, EJS locals contract | L | 1, 2 |
| 7 | [phase-7-showcase-and-dx.md](phase-7-showcase-and-dx.md) | Props editor, search, URL state, grid view, i18n foundation, sitemap/robots, dependency graph page | M | 4, 6 |
| 8 | [phase-8-product.md](phase-8-product.md) | `kui` CLI, registry props schema, MCP as a product, scope decisions recorded as ADRs | L | 4, 6, 7 |

Effort: **S** under a day, **M** a few days, **L** a week or more of focused work.

## Status legend

- `[ ]` not started · `[~]` in progress · `[x]` merged on `main` (add commit hash)
- Tags: `[react]` only kui-react · `[ejs]` only kui-ejs · `[both]` mirror the change in both repos

## Priorities if time is short

The five items below give the most protection per hour. They are all in phases 0 and 1.

1. CI on both repos (phase 1). Neither repo has a single workflow today.
2. Registry snapshot drift check in CI (phase 1). The deployed catalog silently goes stale otherwise.
3. Decide the npm question (phase 3). The package the README advertises does not exist on the registry.
4. Fix the stale path references and package metadata (phase 0). Cheap, and every AI agent reading the repos trips over them.
5. A test skeleton, even ten tests (phase 2). Zero tests today in either repo.

## Related documents

- [AGENTS.md](../../AGENTS.md): authoring rules that every task here must still satisfy.
- [ROADMAP.md](../../ROADMAP.md): the older feature roadmap. Phase 0 refreshes its coverage column; several rows there are marked missing but already shipped.
- [docs/versus/](../versus/): comparisons with other boilerplates. They currently describe kui-react as an installable npm package; phase 3 makes that true or removes the claim.
- `internal-ai-rules/KUI_Package_Rules`: how standalone `@kuraykaraaslan/kui-*` packages are structured. Relevant to phases 3, 4 and 6.
- `internal-ai-rules/UI_Interface_Rules_EJS`: the EJS rules that phase 5 brings kui-ejs into line with (CSRF, CSP, ModalModule).
