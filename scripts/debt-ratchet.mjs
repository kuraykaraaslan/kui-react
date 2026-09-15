#!/usr/bin/env node
// debt-ratchet.mjs — Freeze the known pre-existing debt counts and only
// allow them to go down. See docs/dev/phase-1-ci-and-gates.md section 1.6.
//
// Each metric's definition matches the exact command documented in
// docs/dev/audit-2026-09-15.md's "Commands to reproduce" section, so the
// baseline stays reproducible by hand, not just by this script.
//
// Usage:
//   node scripts/debt-ratchet.mjs            # check against the baseline
//   node scripts/debt-ratchet.mjs --update   # print an updated baseline
//                                             # JSON (only ever paste this
//                                             # back in for counts that fell)

import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { walkSourceFiles } from './lib/walk-source-files.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const BASELINE_FILE = path.join(REPO_ROOT, 'scripts/debt-baseline.json');

function countMatchingLines(dirs, pattern) {
  let count = 0;
  for (const relPath of walkSourceFiles(REPO_ROOT, dirs)) {
    const content = readFileSync(path.join(REPO_ROOT, relPath), 'utf8');
    for (const line of content.split('\n')) {
      if (pattern.test(line)) count++;
    }
  }
  return count;
}

function countMatchingFiles(dirs, pattern, extensions) {
  let count = 0;
  for (const relPath of walkSourceFiles(REPO_ROOT, dirs, extensions)) {
    // Both callers of this (windowDocumentInUi, forwardRefUsages) are about
    // production component patterns (SSR safety, React-19 modernization),
    // not general code quality — a *.test.tsx asserting against
    // document.querySelector or the like is expected and not the debt this
    // is meant to track. Excluded here rather than in countMatchingLines,
    // whose three callers (any/eslint-disable/TODO) are general quality
    // metrics where a hit inside a test file is still real debt.
    if (relPath.endsWith('.test.tsx') || relPath.endsWith('.test.ts')) continue;
    const content = readFileSync(path.join(REPO_ROOT, relPath), 'utf8');
    if (pattern.test(content)) count++;
  }
  return count;
}

function runAndCapture(cmd, args) {
  try {
    return execFileSync(cmd, args, { cwd: REPO_ROOT, encoding: 'utf8' });
  } catch (err) {
    // Non-zero exit is expected — these tools fail when they find problems,
    // which is exactly the count we want. Their output is still on stdout.
    return err.stdout ?? '';
  }
}

function lintErrorCount() {
  const out = runAndCapture('npx', ['eslint', '.']);
  // Target the summary line specifically — "✖ 479 problems (307 errors,
  // 172 warnings)" — not the first per-violation line that happens to
  // contain a number followed by the word "error" (e.g. "12:5  error  ...").
  const m = out.match(/\((\d+)\s+errors?,/);
  return m ? Number(m[1]) : 0;
}

function tokenViolationCount() {
  const out = runAndCapture('node', [path.join(__dirname, 'audit-tokens.mjs')]);
  const m = out.match(/(\d+)\s+violation\(s\)/);
  return m ? Number(m[1]) : 0;
}

function measure() {
  return {
    anyUsages: countMatchingLines(['modules', 'libs', 'app'], /: any\b|as any\b|<any>/),
    eslintDisable: countMatchingLines(['modules', 'app', 'libs'], /eslint-disable/),
    todoFixmeHack: countMatchingLines(['modules', 'app', 'libs'], /TODO|FIXME|HACK/),
    windowDocumentInUi: countMatchingFiles(['modules/ui'], /window\.|document\./, ['.tsx']),
    forwardRefUsages: countMatchingFiles(['modules'], /forwardRef/, ['.tsx']),
    // Entries, not files — a section file holds multiple showcase entries,
    // each with its own `sourceCode:` field.
    showcaseSourceLiterals: countMatchingLines(['modules/showcase/data/sections'], /sourceCode:/),
    lintErrors: lintErrorCount(),
    tokenViolations: tokenViolationCount(),
  };
}

function main() {
  const current = measure();
  const update = process.argv.includes('--update');

  if (update) {
    console.log(JSON.stringify(current, null, 2));
    return;
  }

  if (!existsSync(BASELINE_FILE)) {
    console.error(`No baseline file at ${path.relative(REPO_ROOT, BASELINE_FILE)}.`);
    console.error('Run `node scripts/debt-ratchet.mjs --update` and save the output there to seed one.');
    process.exitCode = 1;
    return;
  }

  const baseline = JSON.parse(readFileSync(BASELINE_FILE, 'utf8'));
  let regressed = false;
  let improved = false;

  console.log('Debt ratchet — current vs. baseline (lower is better):');
  console.log('');
  for (const key of Object.keys(current)) {
    const cur = current[key];
    const base = baseline[key] ?? 0;
    let status = '=';
    if (cur > base) {
      status = `▲ REGRESSION (+${cur - base})`;
      regressed = true;
    } else if (cur < base) {
      status = `▼ improved (-${base - cur})`;
      improved = true;
    }
    console.log(`  ${key.padEnd(24)} ${String(cur).padStart(5)}  (baseline ${base})  ${status}`);
  }
  console.log('');

  if (regressed) {
    console.log('❌  One or more debt counts rose above the baseline. Fix the regression, or if the');
    console.log('    rise is deliberate and reviewed, update scripts/debt-baseline.json in the same PR.');
    process.exitCode = 1;
    return;
  }

  if (improved) {
    console.log('✅  No regressions — and some counts fell! Consider lowering the baseline:');
    console.log('    node scripts/debt-ratchet.mjs --update > scripts/debt-baseline.json');
  } else {
    console.log('✅  No regressions.');
  }
}

main();
