'use client';
import { cn } from '@/libs/utils/cn';
import { useMessages } from '../messages';
import { formatBytes } from './stats';
import type { ContextFill } from './types';

/** Bytes against the class limit: yellow from 80 percent, red at 100. */
export function FillBar({ fill, label }: { fill: ContextFill; label?: string }) {
  const m = useMessages();
  return (
    <div data-testid="insight-ctx-fill" className="mb-2">
      <div className="text-xs tabular-nums leading-normal text-text-secondary">
        {m.insFill(label ?? m.insFillLabel, formatBytes(fill.bytes), formatBytes(fill.limit), fill.pct)}
      </div>
      <span
        role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={fill.pct} aria-label={m.insFillAria}
        data-tone={fill.tone}
        className="mt-1 block h-1 rounded-[2px] bg-border"
      >
        <span
          className={cn('block h-full rounded-[2px]', fill.tone === 'full' ? 'bg-error' : fill.tone === 'warn' ? 'bg-warning' : 'bg-primary')}
          style={{ width: `${fill.pct}%` }}
        />
      </span>
    </div>
  );
}
