'use client';
import { cn } from '@/libs/utils/cn';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Badge } from '@/modules/ui/Badge';
import { SchemaViewer } from './SchemaViewer';
import type { ApiResponse } from './types';

const statusConfig: Record<string, { variant: 'success' | 'info' | 'warning' | 'error' | 'neutral'; label: string }> = {
  '2': { variant: 'success', label: 'Success' },
  '3': { variant: 'info',    label: 'Redirect' },
  '4': { variant: 'warning', label: 'Client Error' },
  '5': { variant: 'error',   label: 'Server Error' },
};

function statusVariant(code: string) {
  return statusConfig[code[0]]?.variant ?? 'neutral';
}

type Props = {
  response: ApiResponse;
  defaultOpen?: boolean;
  className?: string;
};

export function ResponseCard({ response, defaultOpen = false, className }: Props) {
  const [open, setOpen] = useState(defaultOpen);

  const contentEntries = response.content ? Object.entries(response.content) : [];

  return (
    <div className={cn('rounded-lg border border-border overflow-hidden', className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={cn(
          'flex w-full items-center gap-3 px-4 py-3 text-left',
          'bg-surface-raised hover:bg-surface-overlay transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
        )}
      >
        <Badge variant={statusVariant(response.statusCode)} size="md">
          {response.statusCode}
        </Badge>
        <span className="flex-1 text-sm text-text-primary">{response.description}</span>
        {contentEntries.length > 0 && (
          <span className="text-xs text-text-disabled font-mono">{contentEntries[0][0]}</span>
        )}
        <FontAwesomeIcon
          icon={faChevronDown}
          className={cn('w-3 h-3 text-text-disabled shrink-0 transition-transform', open && 'rotate-180')}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div className="border-t border-border bg-surface-base">
          {response.headers && Object.keys(response.headers).length > 0 && (
            <div className="px-4 py-3 border-b border-border">
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">Headers</p>
              <div className="space-y-1.5">
                {Object.entries(response.headers).map(([key, hdr]) => (
                  <div key={key} className="flex items-start gap-3 text-xs">
                    <code className="font-mono text-text-primary shrink-0">{key}</code>
                    {hdr.schema?.type && (
                      <Badge variant="neutral" size="sm">{hdr.schema.type}</Badge>
                    )}
                    {hdr.description && (
                      <span className="text-text-secondary">{hdr.description}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {contentEntries.length > 0 ? (
            <div className="p-4 space-y-3">
              {contentEntries.map(([mime, obj]) => (
                <div key={mime}>
                  <p className="text-xs font-mono text-text-disabled mb-2">{mime}</p>
                  {obj.schema && <SchemaViewer schema={obj.schema} />}
                </div>
              ))}
            </div>
          ) : (
            <p className="px-4 py-3 text-xs text-text-disabled">No response body.</p>
          )}
        </div>
      )}
    </div>
  );
}
