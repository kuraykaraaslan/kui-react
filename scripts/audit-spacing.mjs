#!/usr/bin/env node
// audit-spacing.mjs — Enforce Tailwind's spacing scale: no arbitrary pixel
// values in padding, margin, gap, or space utilities.
//
// Node port of kui-ejs's scripts/lint-spacing.sh (same rule) — pure Node,
// no shell-out to grep, so it runs identically on Windows/mac/Linux.
//
// Flagged (examples): p-[13px] m-[5px] px-[24px] py-[7px] mt-[3px]
//                      mb-[11px] gap-[9px] space-x-[5px]
// NOT flagged (not spacing utilities): w-[...px] h-[...px] text-[...px]
//
// Why: arbitrary pixel spacing bypasses the 4px grid and breaks vertical
// rhythm. Use Tailwind's built-in spacing scale instead (p-4, mt-2, gap-3).
//
// Usage:
//   node scripts/audit-spacing.mjs

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { walkSourceFiles } from './lib/walk-source-files.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');

const SCAN_DIRS = ['modules', 'app'];

// Padding (p, px, py, pt, pb, pl, pr, ps, pe), margin (m + same suffixes),
// gap, space-x/y/s/e, each followed by an arbitrary pixel value.
const SPACING_PATTERN = /(^|[^a-zA-Z-])(p[xytblrse]?|m[xytblrse]?|gap|space-[xyseb])-\[[0-9]+px\]/;

function main() {
  const violations = [];

  for (const relPath of walkSourceFiles(REPO_ROOT, SCAN_DIRS)) {
    if (relPath.includes('/showcase/')) continue;

    const content = readFileSync(path.join(REPO_ROOT, relPath), 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, i) => {
      if (SPACING_PATTERN.test(line)) {
        violations.push(`${relPath}:${i + 1}:${line}`);
      }
    });
  }

  if (violations.length === 0) {
    console.log('✅  Spacing audit passed — no arbitrary pixel spacing values found.');
    return;
  }

  console.log('❌  Spacing audit FAILED — arbitrary pixel spacing values found:');
  console.log('');
  for (const line of violations) console.log(line);
  console.log('');
  console.log(`${violations.length} violation(s).`);
  console.log("Fix: replace arbitrary pixel values with Tailwind's spacing scale.");
  console.log('     e.g. p-[13px] -> p-3 (12px) or p-4 (16px)');
  console.log('          mt-[5px] -> mt-1 (4px) or mt-1.5 (6px)');
  console.log('          gap-[9px] -> gap-2 (8px) or gap-3 (12px)');
  process.exitCode = 1;
}

main();
