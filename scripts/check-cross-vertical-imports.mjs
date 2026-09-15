#!/usr/bin/env node
// check-cross-vertical-imports.mjs — modules/domains/<a>/** must not import
// from modules/domains/<b>/** unless <b> is 'common'. Domain verticals
// compose ui/ + app/ + common/ only; importing sideways between verticals
// (e.g. commerce reaching into fintech) means something belongs in common/
// instead, or the two verticals have accidentally coupled.
//
// Usage:
//   node scripts/check-cross-vertical-imports.mjs

import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { walkSourceFiles } from './lib/walk-source-files.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const DOMAINS_DIR = 'modules/domains';

// Any import path containing /modules/domains/<vertical>/ or ending in
// /modules/domains/<vertical> (barrel import), for verticals other than
// 'common' and the importing file's own.
const IMPORT_RE = /['"]([^'"]*modules\/domains\/([a-z-]+)(?:\/[^'"]*)?)['"]/g;

function main() {
  const verticals = readdirSync(path.join(REPO_ROOT, DOMAINS_DIR), { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name);

  const violations = [];

  for (const vertical of verticals) {
    if (vertical === 'common') continue;
    const dir = `${DOMAINS_DIR}/${vertical}`;
    for (const relPath of walkSourceFiles(REPO_ROOT, [dir])) {
      const content = readFileSync(path.join(REPO_ROOT, relPath), 'utf8');
      for (const match of content.matchAll(IMPORT_RE)) {
        const importedVertical = match[2];
        if (importedVertical === vertical || importedVertical === 'common') continue;
        if (!verticals.includes(importedVertical)) continue; // not actually a vertical name
        violations.push(`${relPath}: imports from domains/${importedVertical} (only domains/common is allowed cross-vertical) -- "${match[1]}"`);
      }
    }
  }

  if (violations.length === 0) {
    console.log('✅  No cross-vertical domain imports found (only domains/<x>/common is allowed).');
    return;
  }

  console.log('❌  Cross-vertical domain imports found:');
  console.log('');
  for (const line of violations) console.log(line);
  console.log('');
  console.log(`${violations.length} violation(s).`);
  console.log('Fix: move the shared piece into modules/domains/common/, or reconsider whether the');
  console.log('     two verticals should really be coupled.');
  process.exitCode = 1;
}

main();
