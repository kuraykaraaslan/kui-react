#!/usr/bin/env node
// kui-react MCP server (stdio, zero-dep).
//
// Exposes the component registry to MCP-compatible AI clients (Claude
// Desktop, Cursor, Cline, Windsurf, Zed). Implements JSON-RPC 2.0 framed
// over stdio per the Model Context Protocol spec.
//
// Reads the static snapshot from public/registry/components.json so it
// works offline; rebuild it via `npm run registry:snapshot`.

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const SNAPSHOT_PATH = path.join(REPO_ROOT, 'public/registry/components.json');

let cachedRegistry = null;
async function getRegistry() {
  if (cachedRegistry) return cachedRegistry;
  const raw = await readFile(SNAPSHOT_PATH, 'utf8');
  cachedRegistry = JSON.parse(raw);
  return cachedRegistry;
}

// -------------------- MCP tool definitions --------------------

const TOOLS = [
  {
    name: 'list_components',
    description:
      'List components in the kui-react registry. Optionally filter by layer (ui|app|domain|theme) or category (Atom|Molecule|Organism|App|Domain|Theme).',
    inputSchema: {
      type: 'object',
      properties: {
        layer:    { type: 'string', enum: ['ui', 'app', 'domain', 'theme'] },
        category: { type: 'string' },
      },
    },
  },
  {
    name: 'get_component',
    description:
      'Get a single component by id, including full source, variants, composes[], a11y metadata, and design tokens.',
    inputSchema: {
      type: 'object',
      required: ['id'],
      properties: { id: { type: 'string' } },
    },
  },
  {
    name: 'search_components',
    description:
      'Substring/fuzzy search across component name + description + filePath. Returns up to `limit` matches (default 20).',
    inputSchema: {
      type: 'object',
      required: ['query'],
      properties: {
        query: { type: 'string' },
        limit: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
      },
    },
  },
  {
    name: 'list_themes',
    description: 'List all full-page theme demos with their route and status.',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'get_conventions',
    description:
      'Return the boilerplate-wide conventions (icons, styling, accessibility, file naming, path alias, types).',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'list_design_tokens',
    description: 'List every CSS-variable design token with light/dark value and purpose.',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'read_file',
    description:
      'Read a file from disk. Path must be repo-relative (e.g. "modules/ui/Button.tsx") and exist within the repository root. Use after `get_component` to fetch the live source on disk.',
    inputSchema: {
      type: 'object',
      required: ['path'],
      properties: { path: { type: 'string' } },
    },
  },
];

// -------------------- Tool implementations --------------------

async function callTool(name, args = {}) {
  const reg = await getRegistry();

  switch (name) {
    case 'list_components': {
      const out = reg.components.filter((c) =>
        (!args.layer    || c.layer === args.layer) &&
        (!args.category || c.category === args.category),
      ).map((c) => ({
        id: c.id, name: c.name, layer: c.layer, category: c.category,
        filePath: c.filePath, abbr: c.abbr, status: c.status,
        description: c.description,
      }));
      return jsonResult(out);
    }

    case 'get_component': {
      const c = reg.components.find((c) => c.id === args.id);
      if (!c) return errorResult(`Unknown component id: ${args.id}`);
      return jsonResult(c);
    }

    case 'search_components': {
      const q = String(args.query || '').toLowerCase();
      const limit = Math.min(Math.max(parseInt(args.limit ?? 20, 10) || 20, 1), 100);
      const scored = [];
      for (const c of reg.components) {
        const hay = `${c.name}\n${c.description}\n${c.filePath}`.toLowerCase();
        const idx = hay.indexOf(q);
        if (idx === -1) continue;
        scored.push({ score: idx, entry: c });
      }
      scored.sort((a, b) => a.score - b.score);
      const out = scored.slice(0, limit).map(({ entry: c }) => ({
        id: c.id, name: c.name, layer: c.layer, category: c.category,
        filePath: c.filePath, status: c.status, description: c.description,
      }));
      return jsonResult(out);
    }

    case 'list_themes':
      return jsonResult(reg.themes);

    case 'get_conventions':
      return jsonResult(reg.conventions);

    case 'list_design_tokens':
      return jsonResult(reg.designTokens);

    case 'read_file': {
      const rel = String(args.path || '');
      const abs = path.resolve(REPO_ROOT, rel);
      if (!abs.startsWith(REPO_ROOT + path.sep)) {
        return errorResult(`Refusing path outside repo: ${rel}`);
      }
      try {
        const src = await readFile(abs, 'utf8');
        return { content: [{ type: 'text', text: src }] };
      } catch (e) {
        return errorResult(`Could not read ${rel}: ${e.message}`);
      }
    }

    default:
      return errorResult(`Unknown tool: ${name}`);
  }
}

function jsonResult(value) {
  return { content: [{ type: 'text', text: JSON.stringify(value, null, 2) }] };
}
function errorResult(message) {
  return { isError: true, content: [{ type: 'text', text: message }] };
}

// -------------------- JSON-RPC framing over stdio --------------------

const SERVER_INFO = { name: 'kui-react-registry', version: '1.0.0' };
const PROTOCOL_VERSION = '2024-11-05';

async function handle(message) {
  if (!message || typeof message !== 'object') return null;
  const { id, method, params } = message;

  try {
    switch (method) {
      case 'initialize':
        return reply(id, {
          protocolVersion: PROTOCOL_VERSION,
          serverInfo: SERVER_INFO,
          capabilities: { tools: {} },
        });

      case 'tools/list':
        return reply(id, { tools: TOOLS });

      case 'tools/call': {
        const result = await callTool(params?.name, params?.arguments || {});
        return reply(id, result);
      }

      case 'ping':
        return reply(id, {});

      // No-op notifications.
      case 'notifications/initialized':
      case 'initialized':
        return null;

      default:
        if (id !== undefined) {
          return reply(id, null, { code: -32601, message: `Method not found: ${method}` });
        }
        return null;
    }
  } catch (err) {
    if (id !== undefined) {
      return reply(id, null, { code: -32000, message: err?.message || String(err) });
    }
    return null;
  }
}

function reply(id, result, error) {
  const payload = { jsonrpc: '2.0', id };
  if (error) payload.error = error;
  else payload.result = result;
  return payload;
}

// Line-delimited JSON framing (one JSON message per line).
let buffer = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', async (chunk) => {
  buffer += chunk;
  let nl;
  while ((nl = buffer.indexOf('\n')) !== -1) {
    const line = buffer.slice(0, nl).trim();
    buffer = buffer.slice(nl + 1);
    if (!line) continue;
    let msg;
    try { msg = JSON.parse(line); } catch { continue; }
    const out = await handle(msg);
    if (out) process.stdout.write(JSON.stringify(out) + '\n');
  }
});
process.stdin.on('end', () => process.exit(0));
