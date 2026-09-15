// walk-source-files.mjs — Recursively yield .ts/.tsx file paths (relative to
// REPO_ROOT) under the given directories. Pure Node, no shell-out — this is
// what makes scripts/audit-*.mjs actually cross-platform (Windows included),
// unlike shelling out to `grep`, which isn't available there by default.

import { readdirSync } from 'node:fs';
import path from 'node:path';

const SKIP_DIRS = new Set(['node_modules', '.next', 'dist', 'out', '.git']);

export function* walkSourceFiles(repoRoot, dirs, extensions = ['.ts', '.tsx']) {
  for (const dir of dirs) {
    yield* walk(repoRoot, dir, extensions);
  }
}

function* walk(repoRoot, relDir, extensions) {
  const absDir = path.join(repoRoot, relDir);
  let entries;
  try {
    entries = readdirSync(absDir, { withFileTypes: true });
  } catch {
    return; // directory doesn't exist — nothing to walk
  }
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const relPath = path.posix.join(relDir.split(path.sep).join('/'), entry.name);
    if (entry.isDirectory()) {
      yield* walk(repoRoot, relPath, extensions);
    } else if (extensions.some((ext) => entry.name.endsWith(ext))) {
      yield relPath;
    }
  }
}
