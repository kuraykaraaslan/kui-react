#!/usr/bin/env node
// audit-conventions.mjs — Runs every convention audit and reports combined
// status. Each individual script's exit code is preserved and OR'd, so this
// exits non-zero if *any* audit fails (unlike a shell `;`-chain, which would
// only reflect the last command's status).
//
// Usage: node scripts/audit-conventions.mjs

import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const AUDITS = ['audit-tokens.mjs', 'audit-spacing.mjs'];

let failed = false;
for (const script of AUDITS) {
  const result = spawnSync(process.execPath, [path.join(__dirname, script)], {
    stdio: 'inherit',
  });
  if (result.status !== 0) failed = true;
  console.log('');
}

process.exitCode = failed ? 1 : 0;
