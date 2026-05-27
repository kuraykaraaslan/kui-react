#!/usr/bin/env node
// Builds offline AI-discoverable artifacts by rendering the internal
// /_internal/snapshot page in a headless browser and capturing
// window.__KUI_REGISTRY__. We use Puppeteer (already a dependency)
// because the showcase data lives behind 'use client' and cannot be
// imported by server-side code.
//
//   1. public/registry/components.json           — full registry JSON
//   2. public/registry/components.index.json     — lightweight index (no source)
//   3. public/components/<id>.md                 — one markdown file per component
//   4. public/components/_index.json             — { id → filePath } map for MD chunks

import { spawn } from 'node:child_process';
import { mkdir, writeFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createServer } from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import puppeteer from 'puppeteer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');

const OUT_REGISTRY_DIR = path.join(REPO_ROOT, 'public/registry');
const OUT_COMPONENTS_DIR = path.join(REPO_ROOT, 'public/components');
const REGISTRY_FILE = path.join(OUT_REGISTRY_DIR, 'components.json');
const INDEX_FILE    = path.join(OUT_REGISTRY_DIR, 'components.index.json');
const COMPONENTS_INDEX_FILE = path.join(OUT_COMPONENTS_DIR, '_index.json');

const READY_TIMEOUT_MS = 60_000;
const POLL_INTERVAL_MS = 500;

async function pickPort() {
  return new Promise((resolve, reject) => {
    const srv = createServer();
    srv.unref();
    srv.on('error', reject);
    srv.listen(0, () => {
      const { port } = srv.address();
      srv.close(() => resolve(port));
    });
  });
}

async function waitForServer(port) {
  // Poll the snapshot page itself until Next compiles + responds.
  const url = `http://localhost:${port}/internal/snapshot`;
  const deadline = Date.now() + READY_TIMEOUT_MS;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
      if (res.status < 500) return;
    } catch { /* not ready yet */ }
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
  }
  throw new Error(`Snapshot page never came up after ${READY_TIMEOUT_MS}ms`);
}

async function captureRegistry(port) {
  const browser = await puppeteer.launch({
    headless: 'shell',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  try {
    const page = await browser.newPage();
    page.on('pageerror', (err) => console.error('[snapshot:page]', err.message));
    await page.goto(`http://localhost:${port}/internal/snapshot`, { waitUntil: 'networkidle0', timeout: READY_TIMEOUT_MS });
    await page.waitForSelector('[data-snapshot-ready]', { timeout: READY_TIMEOUT_MS });
    const reg = await page.evaluate(() => (window).__KUI_REGISTRY__);
    if (!reg || !Array.isArray(reg.components)) {
      throw new Error('window.__KUI_REGISTRY__ was empty or malformed');
    }
    return reg;
  } finally {
    await browser.close();
  }
}

function buildIndex(reg) {
  return {
    ...reg,
    components: reg.components.map(({ source, variants, ...rest }) => ({
      ...rest,
      variantCount: variants?.length ?? 0,
    })),
  };
}

function markdownForComponent(c) {
  const lines = [];
  lines.push(`# ${c.name}`);
  lines.push('');
  lines.push(`- **id:** \`${c.id}\``);
  lines.push(`- **layer:** ${c.layer}`);
  lines.push(`- **category:** ${c.category}`);
  lines.push(`- **filePath:** \`${c.filePath}\``);
  lines.push(`- **status:** ${c.status}`);
  if (c.since) lines.push(`- **since:** ${c.since}`);
  lines.push('');
  if (c.description) { lines.push(c.description); lines.push(''); }

  if (c.whenToUse) {
    lines.push('## When to use');
    lines.push('');
    lines.push(c.whenToUse);
    lines.push('');
  }
  if (c.whenNotToUse) {
    lines.push('## When NOT to use');
    lines.push('');
    lines.push(c.whenNotToUse);
    lines.push('');
  }
  if (c.composes?.length) {
    lines.push('## Depends on');
    lines.push('');
    for (const id of c.composes) lines.push(`- \`${id}\``);
    lines.push('');
  }
  if (c.usedBy?.length) {
    lines.push('## Used by');
    lines.push('');
    for (const id of c.usedBy) lines.push(`- \`${id}\``);
    lines.push('');
  }
  if (c.a11y) {
    lines.push('## Accessibility');
    lines.push('');
    if (c.a11y.wcagLevel) lines.push(`- WCAG: ${c.a11y.wcagLevel}`);
    if (c.a11y.ariaPatterns?.length) lines.push(`- ARIA patterns: ${c.a11y.ariaPatterns.join(', ')}`);
    if (c.a11y.keyboardInteractions?.length) {
      lines.push('- Keyboard:');
      for (const ki of c.a11y.keyboardInteractions) lines.push(`  - \`${ki.keys}\` — ${ki.action}`);
    }
    if (c.a11y.notes) { lines.push(''); lines.push(c.a11y.notes); }
    lines.push('');
  }
  if (c.designTokens?.length) {
    lines.push('## Design tokens consumed');
    lines.push('');
    for (const t of c.designTokens) lines.push(`- \`${t}\``);
    lines.push('');
  }
  if (c.variants?.length) {
    lines.push('## Variants');
    lines.push('');
    for (const v of c.variants) {
      lines.push(`### ${v.title}`);
      lines.push('');
      lines.push('```tsx');
      lines.push(v.code);
      lines.push('```');
      lines.push('');
    }
  }
  if (c.source) {
    lines.push('## Full source');
    lines.push('');
    lines.push('```tsx');
    lines.push(c.source);
    lines.push('```');
    lines.push('');
  }
  return lines.join('\n');
}

async function writeArtifacts(reg) {
  await rm(OUT_REGISTRY_DIR, { recursive: true, force: true });
  await rm(OUT_COMPONENTS_DIR, { recursive: true, force: true });
  await mkdir(OUT_REGISTRY_DIR, { recursive: true });
  await mkdir(OUT_COMPONENTS_DIR, { recursive: true });

  await writeFile(REGISTRY_FILE, JSON.stringify(reg, null, 2) + '\n', 'utf8');
  await writeFile(INDEX_FILE, JSON.stringify(buildIndex(reg), null, 2) + '\n', 'utf8');

  const indexMap = {};
  for (const c of reg.components) {
    const filename = `${c.id}.md`;
    await writeFile(path.join(OUT_COMPONENTS_DIR, filename), markdownForComponent(c), 'utf8');
    indexMap[c.id] = { name: c.name, layer: c.layer, category: c.category, file: filename };
  }
  await writeFile(COMPONENTS_INDEX_FILE, JSON.stringify(indexMap, null, 2) + '\n', 'utf8');

  return { components: reg.components.length, themes: reg.themes.length };
}

async function tryExistingServer() {
  const portEnv = process.env.SNAPSHOT_PORT;
  const candidates = portEnv ? [Number(portEnv)] : [3000, 3001, 3002, 3003];
  // We identify our app by hitting the static /llms.txt — it ships with the
  // boilerplate and other Next apps on these ports won't serve it.
  for (const port of candidates) {
    try {
      const res = await fetch(`http://localhost:${port}/llms.txt`, {
        signal: AbortSignal.timeout(2000),
      });
      if (!res.ok) continue;
      const body = await res.text();
      if (body.includes('kui-react')) {
        console.log(`[snapshot] using existing dev server on port ${port}`);
        return port;
      }
    } catch { /* not listening or wrong app */ }
  }
  return null;
}

async function main() {
  // On Vercel (and other CI) Puppeteer's Chrome isn't installed and the
  // committed snapshot under public/registry + public/components is already
  // the source of truth for the build. Skip regeneration there.
  if (process.env.SKIP_REGISTRY_SNAPSHOT === '1' || process.env.VERCEL || process.env.CI) {
    const haveSnapshot = existsSync(REGISTRY_FILE) && existsSync(INDEX_FILE);
    if (haveSnapshot) {
      console.log('[snapshot] CI/Vercel detected — using committed snapshot, skipping regeneration');
      return;
    }
    console.warn('[snapshot] CI/Vercel detected but no committed snapshot found — attempting regeneration anyway');
  }

  if (!existsSync(path.join(REPO_ROOT, 'node_modules/next'))) {
    console.error('next is not installed. Run `npm install` first.');
    process.exit(1);
  }

  // Fast path — reuse a dev server the user already has running.
  const existingPort = await tryExistingServer();
  if (existingPort) {
    await waitForServer(existingPort);
    const reg = await captureRegistry(existingPort);
    console.log(`[snapshot] captured ${reg.components.length} components from existing server`);
    const stats = await writeArtifacts(reg);
    console.log(`[snapshot] wrote ${stats.components} component .md files + JSON snapshots`);
    return;
  }

  const port = await pickPort();
  console.log(`[snapshot] no dev server found — starting next dev on port ${port}…`);
  const child = spawn(
    'node',
    [path.join('node_modules/next/dist/bin/next'), 'dev', '-p', String(port)],
    {
      cwd: REPO_ROOT,
      env: { ...process.env, NODE_ENV: 'development' },
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  );
  child.stdout.on('data', (b) => process.stdout.write(`[next] ${b}`));
  child.stderr.on('data', (b) => process.stderr.write(`[next] ${b}`));

  let exited = false;
  child.on('exit', (code) => {
    exited = true;
    if (code !== 0 && code !== null) {
      console.error(`[snapshot] next dev exited early with code ${code}`);
    }
  });

  try {
    await waitForServer(port);
    const reg = await captureRegistry(port);
    console.log(`[snapshot] captured ${reg.components.length} components`);
    const stats = await writeArtifacts(reg);
    console.log(`[snapshot] wrote ${stats.components} component .md files + JSON snapshots`);
  } finally {
    if (!exited) {
      child.kill('SIGTERM');
      setTimeout(() => { if (!exited) child.kill('SIGKILL'); }, 3000).unref();
    }
  }
}

main().catch((err) => {
  console.error('[snapshot] failed:', err);
  process.exit(1);
});
