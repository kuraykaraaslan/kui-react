'use client';
import { useState } from 'react';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faEye, faEyeSlash, faCheck, faKey, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Badge } from '@/modules/ui/Badge';

type ApiKeyTokenCardProps = {
  name: string;
  token: string;
  /** Optional masked preview (last 4 chars only). When omitted, the component derives it. */
  masked?: string;
  scopes?: string[];
  createdAt?: Date | string;
  lastUsedAt?: Date | string | null;
  environment?: 'production' | 'staging' | 'development';
  onRevoke?: () => void;
  className?: string;
};

const envVariant: Record<NonNullable<ApiKeyTokenCardProps['environment']>, 'success' | 'warning' | 'neutral'> = {
  production: 'success',
  staging:    'warning',
  development:'neutral',
};

function maskToken(token: string) {
  const tail = token.slice(-4);
  return `${'•'.repeat(Math.max(0, token.length - 4))}${tail}`;
}

function formatDate(d?: Date | string | null) {
  if (!d) return '—';
  const date = typeof d === 'string' ? new Date(d) : d;
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export function ApiKeyTokenCard({
  name,
  token,
  masked,
  scopes,
  createdAt,
  lastUsedAt,
  environment,
  onRevoke,
  className,
}: ApiKeyTokenCardProps) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const display = revealed ? token : (masked ?? maskToken(token));

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(token);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore — clipboard unavailable */
    }
  }

  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-surface-raised p-4 flex flex-col gap-3',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-warning-subtle text-warning">
            <FontAwesomeIcon icon={faKey} className="w-3.5 h-3.5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-text-primary truncate">{name}</p>
            {environment && (
              <Badge variant={envVariant[environment]} size="sm" className="mt-1">
                {environment}
              </Badge>
            )}
          </div>
        </div>

        {onRevoke && (
          <button
            type="button"
            onClick={onRevoke}
            className={cn(
              'inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs text-error border border-error/40',
              'hover:bg-error-subtle transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
            )}
            aria-label={`Revoke ${name}`}
          >
            <FontAwesomeIcon icon={faTrash} className="w-3 h-3" aria-hidden="true" />
            Revoke
          </button>
        )}
      </div>

      <div
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-surface-base',
          'font-mono text-xs text-text-primary',
        )}
      >
        <span className="flex-1 truncate select-all" aria-label="API token">
          {display}
        </span>
        <button
          type="button"
          onClick={() => setRevealed((r) => !r)}
          aria-label={revealed ? 'Hide token' : 'Reveal token'}
          aria-pressed={revealed}
          className={cn(
            'inline-flex items-center justify-center w-7 h-7 rounded text-text-secondary',
            'hover:text-text-primary hover:bg-surface-overlay transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
          )}
        >
          <FontAwesomeIcon icon={revealed ? faEyeSlash : faEye} className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? 'Copied' : 'Copy token to clipboard'}
          className={cn(
            'inline-flex items-center justify-center w-7 h-7 rounded text-text-secondary',
            'hover:text-text-primary hover:bg-surface-overlay transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
            copied && 'text-success',
          )}
        >
          <FontAwesomeIcon icon={copied ? faCheck : faCopy} className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>

      <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
        <div>
          <dt className="text-[10px] uppercase tracking-wider text-text-disabled">Created</dt>
          <dd className="text-text-primary">{formatDate(createdAt)}</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-wider text-text-disabled">Last used</dt>
          <dd className="text-text-primary">{lastUsedAt ? formatDate(lastUsedAt) : 'Never'}</dd>
        </div>
      </dl>

      {scopes && scopes.length > 0 && (
        <div className="flex flex-wrap gap-1.5 border-t border-border pt-3">
          {scopes.map((scope) => (
            <code
              key={scope}
              className="px-1.5 py-0.5 rounded bg-primary-subtle text-primary font-mono text-[11px]"
            >
              {scope}
            </code>
          ))}
        </div>
      )}
    </div>
  );
}
