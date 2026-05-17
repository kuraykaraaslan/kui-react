'use client';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey, faLock, faShield, faFingerprint, faUserShield, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Badge } from '@/modules/ui/Badge';
import { SecuritySchemeBadge } from './SecuritySchemeBadge';
import type { SecuritySchemeType } from './types';

const schemeIcon: Record<SecuritySchemeType, typeof faKey> = {
  apiKey:        faKey,
  http:          faLock,
  oauth2:        faShield,
  openIdConnect: faFingerprint,
  mutualTLS:     faUserShield,
};

type AuthSchemeCardProps = {
  name: string;
  type: SecuritySchemeType;
  description?: string | null;
  recommended?: boolean;
  metaItems?: { label: string; value: React.ReactNode }[];
  href?: string;
  onSelect?: () => void;
  className?: string;
};

export function AuthSchemeCard({
  name,
  type,
  description,
  recommended,
  metaItems,
  href,
  onSelect,
  className,
}: AuthSchemeCardProps) {
  const interactive = !!(href || onSelect);

  const inner = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
              'bg-primary-subtle text-primary',
            )}
          >
            <FontAwesomeIcon icon={schemeIcon[type]} className="w-4 h-4" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-text-primary truncate">{name}</p>
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              <SecuritySchemeBadge type={type} size="sm" />
              {recommended && (
                <Badge variant="success" size="sm">
                  Recommended
                </Badge>
              )}
            </div>
          </div>
        </div>
        {interactive && (
          <FontAwesomeIcon
            icon={faArrowRight}
            className="w-3.5 h-3.5 text-text-disabled mt-1"
            aria-hidden="true"
          />
        )}
      </div>

      {description && (
        <p className="mt-3 text-sm text-text-secondary leading-relaxed">{description}</p>
      )}

      {metaItems && metaItems.length > 0 && (
        <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 border-t border-border pt-3">
          {metaItems.map((item) => (
            <div key={item.label}>
              <dt className="text-[10px] uppercase tracking-wider text-text-disabled">
                {item.label}
              </dt>
              <dd className="text-xs text-text-primary font-mono break-words">{item.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </>
  );

  const base = cn(
    'block rounded-xl border border-border bg-surface-raised p-4 text-left',
    interactive && 'transition-shadow hover:shadow-md hover:border-border-focus focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
    className,
  );

  if (href) return <a href={href} className={base}>{inner}</a>;
  if (onSelect) return <button type="button" onClick={onSelect} className={cn(base, 'w-full')}>{inner}</button>;
  return <div className={base}>{inner}</div>;
}
