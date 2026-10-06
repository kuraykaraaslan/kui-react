'use client';
import { cn } from '@/libs/utils/cn';
import { formatBytes } from './stats';
import type { ContextFill } from './types';

/** Bytes against the class limit: yellow from 80 percent, red at 100. */
export function FillBar({ fill, label = 'The store of all flows' }: { fill: ContextFill; label?: string }) {
  return (
    <div data-testid="insight-ctx-fill" className="mb-3">
      <p className="mb-1 text-xs tabular-nums text-text-secondary">
        {label}: {formatBytes(fill.bytes)} of {formatBytes(fill.limit)} used ({fill.pct}%).
      </p>
      <div
        role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={fill.pct} aria-label="Context store used"
        data-tone={fill.tone}
        className="h-2 w-full overflow-hidden rounded-full bg-surface-sunken"
      >
        <div
          className={cn('h-full rounded-full', fill.tone === 'full' ? 'bg-error' : fill.tone === 'warn' ? 'bg-warning' : 'bg-primary')}
          style={{ width: `${fill.pct}%` }}
        />
      </div>
    </div>
  );
}
