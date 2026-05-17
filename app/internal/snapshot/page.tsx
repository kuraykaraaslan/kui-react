'use client';
// Internal page used ONLY by scripts/build-registry-snapshot.mjs.
//
// The /api/registry route handler cannot call buildRegistry() server-side
// because the showcase data lives behind 'use client' (its demo wrappers
// use React hooks). This page renders client-side, builds the registry,
// and exposes it on window so a headless browser can capture it.

import { useEffect, useState } from 'react';
import { buildRegistry } from '@/modules/registry/registry';

export default function RegistrySnapshotPage() {
  const [status, setStatus] = useState<'building' | 'ready' | 'error'>('building');
  const [count, setCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const reg = buildRegistry();
      (window as unknown as { __KUI_REGISTRY__?: unknown }).__KUI_REGISTRY__ = reg;
      setCount(reg.components.length);
      setStatus('ready');
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setStatus('error');
    }
  }, []);

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
