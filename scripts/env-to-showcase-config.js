// Usage:
//   node scripts/env-to-showcase-config.js [path/to/.env]
//
// Reads NEXT_PUBLIC_* values from the given env file (default: .env.local) and
// rewrites libs/config/showcase.config.ts with the values baked in as plain
// literals. The same exports are preserved (SHOWCASE_BRAND, SHOWCASE_LINKS,
// SHOWCASE_COLORS, buildShowcaseColorCss) so callers keep working.
//
// Examples:
//   node scripts/env-to-showcase-config.js                # uses .env.local
//   node scripts/env-to-showcase-config.js .env.roltek
//   node scripts/env-to-showcase-config.js .env.avantleap

const path = require('path');
const { bakeShowcaseConfig } = require('./lib/bake-showcase-config');

const ROOT = path.resolve(__dirname, '..');
const ENV_ARG = process.argv[2] || '.env.local';
const ENV_PATH = path.resolve(ROOT, ENV_ARG);
const OUT_PATH = path.resolve(ROOT, 'libs/config/showcase.config.ts');

bakeShowcaseConfig({ envPath: ENV_PATH, outPath: OUT_PATH, sourceLabel: ENV_ARG });
console.log(`✓ ${ENV_ARG} → ${path.relative(ROOT, OUT_PATH)}`);
