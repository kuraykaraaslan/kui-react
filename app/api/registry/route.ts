// Serves the machine-readable component registry as JSON.
//
//   GET /api/registry           → full registry (includes source code, large)
//   GET /api/registry?index=1   → index-only (no source, faster for AI search)
//
// Reads the static snapshot at public/registry/components.json (built by
// `npm run registry:snapshot`). The snapshot exists because the showcase
// data lives behind 'use client' and cannot be invoked from a server-side
// route handler — see scripts/build-registry-snapshot.mjs.

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const SNAPSHOT_PATH = path.join(process.cwd(), 'public/registry/components.json');

type AnyRegistry = { components?: unknown[] };

let cached: AnyRegistry | null = null;
async function loadSnapshot(): Promise<AnyRegistry> {
  if (cached) return cached;
  const raw = await readFile(SNAPSHOT_PATH, 'utf8');
  cached = JSON.parse(raw) as AnyRegistry;
  return cached;
}

function asIndex(full: AnyRegistry): AnyRegistry {
  const components = (full.components ?? []).map((c) => {
    const { source: _source, variants, ...rest } = c as Record<string, unknown> & { variants?: unknown[] };
    return { ...rest, variantCount: Array.isArray(variants) ? variants.length : 0 };
  });
  return { ...full, components };
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const indexOnly = url.searchParams.get('index') === '1';
    const full = await loadSnapshot();
    const payload = indexOnly ? asIndex(full) : full;
    return NextResponse.json(payload, {
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      {
        error: 'Registry snapshot not available. Run `npm run registry:snapshot` to build it.',
        detail: message,
      },
      { status: 503 },
    );
  }
}
