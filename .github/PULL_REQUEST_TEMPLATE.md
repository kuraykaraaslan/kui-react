## Summary

<!-- What changed and why. Link an issue if there is one. -->

## Checklist

- [ ] Followed the conventions in `AGENTS.md` (client directive / named exports / `cn()` / design tokens / ARIA — react; escaping / locals / raw-output allowlist — ejs)
- [ ] Added or updated a showcase entry with at least 2 variants, if a component changed
- [ ] Registered the component in `showcase.menu.ts`, if new
- [ ] Ran `npm run registry:snapshot` and committed the regenerated `public/registry/**` and `public/components/**`
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run lint` passes
- [ ] `npm run build` succeeds

## Screenshots

<!-- For visible UI changes, before/after screenshots or a short clip. -->
