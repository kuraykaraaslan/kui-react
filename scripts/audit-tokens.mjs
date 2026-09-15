#!/usr/bin/env node
// audit-tokens.mjs — Verify CSS token contract: no raw hex color codes
// outside an explicit, justified allowlist.
//
// Node port of kui-ejs's scripts/audit-tokens.sh (same rule, same shape of
// allowlist) — pure Node, no shell-out to grep, so it runs identically on
// Windows/mac/Linux and in CI. See docs/dev/audit-2026-09-15.md for how the
// original count was measured and
// docs/adr/0004-token-only-styling-and-font-awesome-only-icons.md for why
// the rule exists.
//
// Scoped to modules/ only: AGENTS.md's "token-only styling" rule is a
// Component Authoring Rule for modules/ui, modules/app, modules/domains —
// app/theme/** pages are full-page demos explicitly allowed their own
// per-theme creative styling (see "Rules for theme pages" in AGENTS.md,
// which does not repeat the token-only constraint), and app/layout.tsx's
// viewport.themeColor / app/api/og's Satori rendering both need literal
// hex by contract (a <meta> tag and an off-DOM image renderer, neither of
// which resolves CSS custom properties).
//
// Usage:
//   node scripts/audit-tokens.mjs

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { walkSourceFiles } from './lib/walk-source-files.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');

const SCAN_DIRS = ['modules'];

// Matches exactly 3, 6, or 8 hex chars after `#`, not followed by another
// hex char — avoids false positives like `#1042` (an order/invoice number).
// (A 3-hex-digit coincidence — e.g. a literal string "#042" — can still
// false-positive; that's an inherent limit of this heuristic, not this
// script's bug. Allowlist the specific line if it ever happens.)
const HEX_PATTERN = /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3})(?![0-9a-fA-F])/;

// Every entry needs a one-line reason. Keep this list and
// docs/adr/0004-token-only-styling-and-font-awesome-only-icons.md in sync.
const ALLOWLIST = [
  {
    path: 'modules/ui/ColorPicker/',
    reason:
      "A color picker's swatch palette and hex placeholder are, by definition, arbitrary colors the user can choose — not design-system tokens.",
  },
  {
    path: 'modules/ui/MapView/parts/Popup.tsx',
    reason:
      "Leaflet popup HTML is built as a string passed to Leaflet's own API; CSS classes and custom properties cannot be used inside it.",
  },
  {
    path: 'modules/ui/MapView/types.ts',
    reason:
      "Default marker/status colors passed to Leaflet's JS API as plain strings, same as Popup.tsx above — Leaflet does not resolve CSS custom properties.",
  },
  {
    path: 'modules/registry/registry.ts',
    reason:
      'DESIGN_TOKENS: this *is* the token contract — the array that declares what each --token-name resolves to. Every other file in this audit exists to make sure it references this instead of repeating itself.',
  },
  {
    path: 'modules/domains/media/chart/WatchTimeChart.tsx',
    reason: 'Chart.js dataset option — the library reads it before the browser resolves CSS variables.',
  },
  {
    path: 'modules/domains/common/charts/Charts.tsx',
    reason: 'Chart.js dataset option — same as above.',
  },
  {
    path: 'modules/domains/fintech/portfolio/AssetAllocationCard.tsx',
    reason: 'Chart.js dataset option — same as above.',
  },
  {
    path: 'modules/domains/fintech/chart/PortfolioDonutChart.tsx',
    reason: 'Chart.js dataset option — same as above.',
  },
  {
    path: 'modules/domains/fintech/crypto/CryptoPriceCard.tsx',
    reason:
      'Chart.js-adjacent sparkline color, read before CSS variables resolve — same rationale as the other Chart.js sites above.',
  },
  {
    path: 'modules/domains/common/auth/OAuthButtons.tsx',
    reason: 'OAuth provider brand colors (Google, Discord, Microsoft) — spec-mandated brand identity, not design-system colors.',
  },
  {
    path: 'modules/domains/common/payment/CreditCardVisual.tsx',
    reason: 'Payment network brand gradients (Visa, Mastercard, Amex, etc.) — official brand colors.',
  },
  {
    path: 'modules/domains/common/seo/SeoPreview.tsx',
    reason:
      "`text-[#1a0dab]` mimics Google's actual search-result link color so the preview reads as a real SERP snippet — represents a third party's fixed UI, not this design system's.",
  },
  {
    path: 'modules/domains/forum/user/BadgeShelf.tsx',
    reason:
      'Bronze/silver/gold medal-tier colors represent real materials, not design-system semantics — same category as the brand-color exceptions above.',
  },
  {
    path: 'modules/domains/iot/ruleset/RulesetEditor/editors/CodeEditor.tsx',
    reason:
      "A code-editor mockup's syntax-highlighting palette (GitHub-dark-style) is conventionally fixed regardless of the app's light/dark mode, the same way a real editor's dark gutter/background does not follow the host app's theme.",
  },
];

function isAllowlisted(relPath) {
  return ALLOWLIST.some((entry) => relPath === entry.path || relPath.startsWith(entry.path));
}

function main() {
  const violations = [];

  for (const relPath of walkSourceFiles(REPO_ROOT, SCAN_DIRS)) {
    if (relPath.includes('/showcase/')) continue;
    if (isAllowlisted(relPath)) continue;

    const content = readFileSync(path.join(REPO_ROOT, relPath), 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, i) => {
      if (HEX_PATTERN.test(line)) {
        violations.push(`${relPath}:${i + 1}:${line}`);
      }
    });
  }

  if (violations.length === 0) {
    console.log('✅  Token audit passed — no raw hex codes found outside the allowlist.');
    return;
  }

  console.log('❌  Token audit FAILED — raw hex codes found outside the allowlist:');
  console.log('');
  for (const line of violations) console.log(line);
  console.log('');
  console.log(`${violations.length} violation(s).`);
  console.log('Fix: replace hex values with CSS token utilities (bg-primary, text-text-secondary, etc.)');
  console.log('     or add the file to ALLOWLIST in scripts/audit-tokens.mjs with a one-line justification.');
  process.exitCode = 1;
}

main();
