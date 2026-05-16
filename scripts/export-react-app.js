// Usage:
//   node scripts/export-react-app.js <env-file> [out-dir]
//
// Copies the entire project into ../exported-react-<brand>/ (sibling of the
// project), then bakes the given env into the copy's libs/config/showcase.config.ts.
// The brand suffix is taken from the env filename (e.g. .env.roltek → roltek).
//
// The exported copy excludes: node_modules, .next, .git, build artifacts,
// any .env* file (except .env.example), and previous exported-react-* dirs.
//
// Examples:
//   node scripts/export-react-app.js .env.roltek
//     → ../exported-react-roltek/
//   node scripts/export-react-app.js .env.avantleap /tmp/builds
//     → /tmp/builds/exported-react-avantleap/

const fs = require('fs');
const path = require('path');
const { bakeShowcaseConfig } = require('./lib/bake-showcase-config');

const ROOT = path.resolve(__dirname, '..');

const envArg = process.argv[2];
if (!envArg) {
  console.error('Error: env file required.');
  console.error('Usage: node scripts/export-react-app.js <env-file> [out-dir]');
  process.exit(1);
}

const ENV_PATH = path.resolve(ROOT, envArg);
if (!fs.existsSync(ENV_PATH)) {
  console.error(`Error: env file not found: ${ENV_PATH}`);
  process.exit(1);
}

// Brand slug = env filename suffix (.env.roltek → "roltek").
// Falls back to the basename without leading dot if no .env.* pattern matches.
const envName = path.basename(envArg);
const brandSlug =
  envName.startsWith('.env.') ? envName.slice('.env.'.length) : envName.replace(/^\./, '');

const OUT_PARENT = process.argv[3]
  ? path.resolve(process.argv[3])
  : path.resolve(ROOT, '..');
const OUT_DIR = path.join(OUT_PARENT, `exported-react-${brandSlug}`);

// Resolved real paths used by the copy filter so symlinks don't fool us.
const ROOT_REAL = fs.realpathSync(ROOT);
const OUT_DIR_REAL = path.resolve(OUT_DIR); // may not exist yet

// Top-level directories to skip outright (relative to project root).
const SKIP_DIRS = new Set([
  'node_modules',
  '.next',
  '.git',
  '.turbo',
  '.vercel',
  '.claude',
  '.vscode',
  '.idea',
  'out',
  'build',
  'dist',
  'coverage',
]);

// File patterns to skip.
const SKIP_FILES = new Set([
  '.DS_Store',
  'next-env.d.ts',
]);

function shouldSkip(src) {
  const rel = path.relative(ROOT_REAL, src);
  if (!rel || rel.startsWith('..')) return false; // root itself, never skip

  const segments = rel.split(path.sep);
  const top = segments[0];
  const base = path.basename(src);

  // Don't recurse into previous exports if they live inside the project.
  if (top.startsWith('exported-react-')) return true;

  // Skip well-known build / dependency directories.
  if (SKIP_DIRS.has(top)) return true;

  // Skip env files except .env.example so brands don't leak into each other.
  if (base.startsWith('.env') && base !== '.env.example') return true;

  // Misc skip files.
  if (SKIP_FILES.has(base)) return true;

  // Skip log + tsbuildinfo files.
  if (/\.tsbuildinfo$/.test(base)) return true;
  if (/-debug\.log$/.test(base)) return true;

  return false;
}

if (fs.existsSync(OUT_DIR)) {
  console.error(`Error: output directory already exists: ${OUT_DIR}`);
  console.error('Remove it first or pick a different output location.');
  process.exit(1);
}

// Safety: never let the destination sit inside the source tree.
if (path.resolve(OUT_DIR_REAL).startsWith(ROOT_REAL + path.sep)) {
  console.error(`Error: output directory is inside the project root: ${OUT_DIR}`);
  process.exit(1);
}

console.log(`→ Copying project`);
console.log(`  from: ${ROOT_REAL}`);
console.log(`  to:   ${OUT_DIR}`);

fs.cpSync(ROOT_REAL, OUT_DIR, {
  recursive: true,
  dereference: false,
  preserveTimestamps: true,
  filter: (src) => !shouldSkip(src),
});

const OUT_CONFIG = path.join(OUT_DIR, 'libs/config/showcase.config.ts');
console.log(`→ Baking ${envArg} into libs/config/showcase.config.ts`);
bakeShowcaseConfig({
  envPath: ENV_PATH,
  outPath: OUT_CONFIG,
  sourceLabel: envArg,
});

console.log(`✓ Exported to ${OUT_DIR}`);
