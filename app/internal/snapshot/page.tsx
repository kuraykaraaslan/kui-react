'use client';
// Internal page used ONLY by scripts/build-registry-snapshot.mjs.
//
// The /api/registry route handler cannot call buildRegistry() server-side
// because the showcase data lives behind 'use client' (its demo wrappers
// use React hooks). This page renders client-side, builds the registry,
// and exposes it on window so a headless browser can capture it.

import { useLayoutEffect, useMemo } from 'react';
import { buildRegistry } from '@/modules/registry/registry';
import { useIsClient } from '@/libs/hooks/useIsClient';

type BuildResult =
  | { status: 'ready'; registry: ReturnType<typeof buildRegistry> }
  | { status: 'error'; error: string };

export default function RegistrySnapshotPage() {
  const isClient = useIsClient();

  // Built on the client only — never during SSR.
  const result = useMemo<BuildResult | null>(() => {
    if (!isClient) return null;
    try {
      return { status: 'ready', registry: buildRegistry() };
    } catch (e) {
      return { status: 'error', error: e instanceof Error ? e.message : String(e) };
    }
  }, [isClient]);

  // Publish before the browser can observe the "ready" marker.
  useLayoutEffect(() => {
    if (result?.status === 'ready') {
      (window as unknown as { __KUI_REGISTRY__?: unknown }).__KUI_REGISTRY__ = result.registry;
    }
  }, [result]);

  const status = result?.status ?? 'building';
  const count = result?.status === 'ready' ? result.registry.components.length : 0;
  const error = result?.status === 'error' ? result.error : null;

  return (
    <main id="main-content" className="min-h-screen bg-surface-base p-8 font-mono text-text-primary">
      <h1 className="text-xl font-semibold">kui-react registry snapshot</h1>
      <p className="mt-2 text-text-secondary">Used by `npm run registry:snapshot` via Puppeteer.</p>
      <div className="mt-6 rounded-md border border-border bg-surface-raised p-4" data-snapshot-status={status}>
        {status === 'building' && <span>Building registry…</span>}
        {status === 'ready' && <span data-snapshot-ready="1">Ready — {count} components on window.__KUI_REGISTRY__</span>}
        {status === 'error' && <span data-snapshot-error="1" className="text-error">Error: {error}</span>}
      </div>
    </main>
  );
}
