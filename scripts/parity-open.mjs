#!/usr/bin/env node
// npm run parity:open <id> — opens the same component in both showcases
// side by side, per docs/dev/phase-7-showcase-and-dx.md 7.6. Needs both
// dev servers already running (kui-react on :3002, kui-ejs on :3003 —
// see README's "Ports" section).
//
// No `open`/`opener` dependency: tries the platform's native launcher
// (macOS `open`, Linux `xdg-open`, Windows `start`) and just prints both
// URLs either way, since headless/remote dev environments (this one
// included) can't open a local browser at all.

import { spawn } from 'node:child_process';

const id = process.argv[2];
if (!id) {
  console.error('Usage: npm run parity:open <component-id>');
  console.error('Example: npm run parity:open button');
  process.exit(1);
}

const reactUrl = `http://localhost:3002/${id}`;
const ejsUrl = `http://localhost:3003/${id}`;

console.log('kui-react:', reactUrl);
console.log('kui-ejs:  ', ejsUrl);

const opener =
  process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';

for (const url of [reactUrl, ejsUrl]) {
  // spawn() failures (no local browser — headless/remote environment,
  // this one included) surface as an async 'error' event, not a thrown
  // exception, so a try/catch here wouldn't catch them.
  const child = spawn(opener, [url], { stdio: 'ignore', detached: true, shell: process.platform === 'win32' });
  child.on('error', () => {});
  child.unref();
}
