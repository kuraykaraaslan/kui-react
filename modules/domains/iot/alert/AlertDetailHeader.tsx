'use client';
import { cn } from '@/libs/utils/cn';
import { Button } from '@/modules/ui/Button';
import { Badge } from '@/modules/ui/Badge';
import { AlertSeverityBadge } from './AlertSeverityBadge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMicrochip,
  faClock,
  faBookOpen,
  faCheck,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import type { AlertSeverity, AlertStatus } from '../types';

type AlertDetailHeaderProps = {
  title: string;
  message?: string;
  severity: AlertSeverity;
  status: AlertStatus;
  deviceName: string;
  deviceHref?: string;
  openedAt: Date | string;
  onAcknowledge?: () => void;
  onResolve?: () => void;
  onOpenRunbook?: () => void;
  className?: string;
};

const STATUS_VARIANT: Record<AlertStatus, 'error' | 'warning' | 'success'> = {
  OPEN: 'error',
  ACKNOWLEDGED: 'warning',
  RESOLVED: 'success',
};

function shortDate(date: Date | string): string {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function AlertDetailHeader({
  title,
  message,
  severity,
  status,
  deviceName,
  deviceHref,
  openedAt,
  onAcknowledge,
  onResolve,
  onOpenRunbook,
  className,
}: AlertDetailHeaderProps) {
  return (
    <section
      className={cn(
        'rounded-xl border border-border bg-surface-raised p-5 shadow-sm',
        className,
      )}
      aria-label={`Alert: ${title}`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <AlertSeverityBadge severity={severity} />
        <Badge variant={STATUS_VARIANT[status]} size="sm">
          {status}
        </Badge>
      </div>

      <h1 className="mt-3 text-xl font-bold text-text-primary leading-snug">{title}</h1>
      {message && (
        <p className="mt-1.5 text-sm text-text-secondary leading-relaxed">{message}</p>
      )}

      <dl className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-text-secondary">
        <div className="flex items-center gap-1.5">
          <FontAwesomeIcon icon={faMicrochip} className="w-3.5 h-3.5" aria-hidden="true" />
          <dt className="sr-only">Device</dt>
          <dd>
            {deviceHref ? (
              <a
                href={deviceHref}
                className="font-medium text-text-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus rounded"
              >
                {deviceName}
              </a>
            ) : (
              <span className="font-medium text-text-primary">{deviceName}</span>
            )}
          </dd>
        </div>
        <div className="flex items-center gap-1.5">
          <FontAwesomeIcon icon={faClock} className="w-3.5 h-3.5" aria-hidden="true" />
          <dt className="sr-only">Opened</dt>
          <dd>Opened {shortDate(openedAt)}</dd>
        </div>
      </dl>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
        {onAcknowledge && status === 'OPEN' && (
          <Button
            variant="outline"
            size="sm"
            onClick={onAcknowledge}
            iconLeft={<FontAwesomeIcon icon={faCheck} className="w-3 h-3" aria-hidden="true" />}
          >
            Acknowledge
          </Button>
        )}
        {onResolve && status !== 'RESOLVED' && (
          <Button
            variant="primary"
            size="sm"
            onClick={onResolve}
            iconLeft={<FontAwesomeIcon icon={faXmark} className="w-3 h-3" aria-hidden="true" />}
          >
            Resolve
          </Button>
        )}
        {onOpenRunbook && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenRunbook}
            iconLeft={<FontAwesomeIcon icon={faBookOpen} className="w-3 h-3" aria-hidden="true" />}
          >
            Runbook
          </Button>
        )}
      </div>
    </section>
  );
}
