'use client';
import { cn } from '@/libs/utils/cn';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faTriangleExclamation, faLock } from '@fortawesome/free-solid-svg-icons';
import { HttpMethodBadge } from './HttpMethodBadge';
import { OperationPanel } from './OperationPanel';
import type { Operation } from './types';

type Props = {
  path: string;
  operation: Operation;
  defaultOpen?: boolean;
  className?: string;
};

export function EndpointRow({ path, operation, defaultOpen = false, className }: Props) {
  const [open, setOpen] = useState(defaultOpen);

  const hasSecurity = (operation.security?.length ?? 0) > 0;

  return (
    <div className={cn('rounded-xl border border-border overflow-hidden', className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={cn(
          'flex w-full items-center gap-3 px-4 py-3 text-left',
          'bg-surface-raised hover:bg-surface-overlay transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
          open && 'border-b border-border',
        )}
      >
        <HttpMethodBadge method={operation.method} />

        <code className="flex-1 truncate font-mono text-sm text-text-primary">{path}</code>

        <div className="flex items-center gap-2 shrink-0">
          {operation.summary && (
            <span className="hidden sm:block text-xs text-text-secondary truncate max-w-[240px]">
              {operation.summary}
            </span>
          )}
          {hasSecurity && (
            <FontAwesomeIcon icon={faLock} className="w-3 h-3 text-text-disabled" aria-label="Requires authentication" />
          )}
          {operation.deprecated && (
            <FontAwesomeIcon icon={faTriangleExclamation} className="w-3.5 h-3.5 text-warning" aria-label="Deprecated" />
          )}
          <FontAwesomeIcon
            icon={faChevronDown}
            className={cn('w-3 h-3 text-text-disabled transition-transform', open && 'rotate-180')}
            aria-hidden="true"
          />
        </div>
      </button>

      {open && <OperationPanel operation={operation} className="rounded-none border-0 border-t-0" />}
    </div>
  );
}
