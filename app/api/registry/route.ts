// Serves the machine-readable component registry as JSON.
//
//   GET /api/registry           → full registry (includes source code, large)
//   GET /api/registry?index=1   → index-only (no source, faster for AI search)
//
// Consumed by AI tools, code generators, and the showcase /llms route. See
// modules/registry/registry.ts for how the registry is built.

import { NextResponse } from 'next/server';
import { buildRegistry, buildRegistryIndex } from '@/modules/registry/registry';

export const dynamic = 'force-dynamic';

export function GET(request: Request) {
  const url = new URL(request.url);
  const indexOnly = url.searchParams.get('index') === '1';
  const payload = indexOnly ? buildRegistryIndex() : buildRegistry();
  return NextResponse.json(payload, {
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
