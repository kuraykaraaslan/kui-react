// scripts/sync-kui-viewer-assets.mjs
//
// kui-viewer (≥ 0.0.7) loads its IFC parser as a Web Worker from the absolute
// URL `/assets/ifc-parser.worker-<hash>.js`, and that worker in turn calls
// `SetWasmPath("/wasm/")` to fetch the web-ifc WASM from `/wasm/web-ifc*.wasm`.
// Neither path is bundled by Next — they must be served as static files from
// `public/`. This script copies them out of node_modules so the viewer's model
// loading works. The worker filename is content-hashed, so we copy the whole
// `dist/assets` directory rather than hard-coding the hash (which changes on
// every package bump). Wired into `predev` + `prebuild` so it stays in sync.

import { existsSync, mkdirSync, readdirSync, copyFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = join(ROOT, 'public');

function ensureDir(dir) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function copyInto(srcFile, destDir) {
  ensureDir(destDir);
  copyFileSync(srcFile, join(destDir, srcFile.split('/').pop()));
}

let copied = 0;

// 1) The IFC parser worker(s) → /assets/
const assetsSrc = join(ROOT, 'node_modules/kui-viewer/dist/assets');
if (existsSync(assetsSrc)) {
  const dest = join(PUBLIC, 'assets');
  for (const name of readdirSync(assetsSrc)) {
    if (!name.endsWith('.js') && !name.endsWith('.js.map')) continue;
    copyInto(join(assetsSrc, name), dest);
    copied++;
  }
} else {
  console.warn('[kui-viewer:assets] kui-viewer/dist/assets not found — skipping worker copy');
}

// 2) web-ifc WASM (+ optional multithreaded worker) → /wasm/
// CRITICAL: the WASM must match the web-ifc JS glue that kui-viewer bundled
// into its worker (currently web-ifc ^0.0.55). The host's top-level
// `node_modules/web-ifc` may be a *different* (hoisted) version — copying that
// triggers `WebAssembly.instantiate(): Import #0 "env"…` at runtime. So prefer
// kui-viewer's own nested copy, falling back to the top-level only if absent.
const wasmCandidates = [
  join(ROOT, 'node_modules/kui-viewer/node_modules/web-ifc'),
  join(ROOT, 'node_modules/web-ifc'),
];
const wasmSrc = wasmCandidates.find((p) => existsSync(p));
if (wasmSrc) {
  const dest = join(PUBLIC, 'wasm');
  for (const name of ['web-ifc.wasm', 'web-ifc-mt.wasm', 'web-ifc-mt.worker.js']) {
    const file = join(wasmSrc, name);
    if (existsSync(file) && statSync(file).isFile()) {
      copyInto(file, dest);
      copied++;
    }
  }
} else {
  console.warn('[kui-viewer:assets] web-ifc package not found — skipping wasm copy');
}

console.log(`[kui-viewer:assets] synced ${copied} file(s) into public/{assets,wasm}`);
