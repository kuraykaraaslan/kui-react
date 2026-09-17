'use client';
import { cn } from '@/libs/utils/cn';
import { Badge } from '@/modules/ui/Badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCloud,
  faMicrochip,
  faUsers,
  faGlobe,
  faCheckCircle,
  faCircleExclamation,
  faClock,
} from '@fortawesome/free-solid-svg-icons';
import type { CloudWorkspace, CloudStatus } from '../types';

const statusConfig: Record<CloudStatus, { icon: typeof faCheckCircle; iconClass: string; badgeVariant: 'success' | 'warning' | 'neutral' }> = {
  ACTIVE:    { icon: faCheckCircle,      iconClass: 'text-success',  badgeVariant: 'success' },
  SUSPENDED: { icon: faCircleExclamation, iconClass: 'text-error',    badgeVariant: 'warning' },
  PENDING:   { icon: faClock,            iconClass: 'text-warning',  badgeVariant: 'neutral' },
};

const planColors: Record<string, string> = {
  FREE:         'bg-surface-overlay text-text-secondary',
  STARTER:      'bg-info-subtle text-info',
  PROFESSIONAL: 'bg-primary-subtle text-primary',
  ENTERPRISE:   'bg-[#f3e8ff] text-[#7c3aed]',
};

type CloudWorkspaceCardProps = {
  workspace: CloudWorkspace;
  className?: string;
  onClick?: () => void;
};

export function CloudWorkspaceCard({ workspace, className, onClick }: CloudWorkspaceCardProps) {
  const status = statusConfig[workspace.status];
  const onlinePercent = workspace.deviceCount > 0
    ? Math.round((workspace.onlineCount / workspace.deviceCount) * 100)
    : 0;

  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
      className={cn(
        'flex flex-col gap-4 rounded-xl border border-border bg-surface-base p-5',
        'transition-shadow hover:shadow-md',
        onClick && 'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-subtle text-primary">
            <FontAwesomeIcon icon={faCloud} className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-text-primary">{workspace.name}</p>
            <p className="truncate text-xs text-text-secondary">/{workspace.slug}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <Badge variant={status.badgeVariant} size="sm" dot>
            {workspace.status.charAt(0) + workspace.status.slice(1).toLowerCase()}
          </Badge>
          <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', planColors[workspace.plan])}>
            {workspace.plan}
          </span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 rounded-lg bg-surface-raised p-2.5">
          <FontAwesomeIcon icon={faMicrochip} className="w-3.5 h-3.5 text-text-secondary" aria-hidden="true" />
          <div>
            <p className="text-xs text-text-secondary">Devices</p>
            <p className="text-sm font-semibold text-text-primary">{workspace.deviceCount}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-surface-raised p-2.5">
          <FontAwesomeIcon icon={faUsers} className="w-3.5 h-3.5 text-text-secondary" aria-hidden="true" />
          <div>
            <p className="text-xs text-text-secondary">Members</p>
            <p className="text-sm font-semibold text-text-primary">{workspace.memberCount}</p>
          </div>
        </div>
      </div>

      {/* Online progress */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-text-secondary">Online devices</span>
          <span className="font-medium text-text-primary">{workspace.onlineCount} / {workspace.deviceCount}</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-surface-sunken overflow-hidden">
          <div
            className="h-full rounded-full bg-success transition-all"
            style={{ width: `${onlinePercent}%` }}
            role="progressbar"
            aria-label="Online devices"
            aria-valuenow={onlinePercent}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-1.5 border-t border-border pt-3 text-xs text-text-secondary">
        <FontAwesomeIcon
          icon={status.icon}
          className={cn('w-3.5 h-3.5', status.iconClass)}
          aria-hidden="true"
        />
        {workspace.customDomain ? (
          <span className="flex items-center gap-1">
            <FontAwesomeIcon icon={faGlobe} className="w-3 h-3" aria-hidden="true" />
            {workspace.customDomain}
          </span>
        ) : (
          <span>{workspace.region ?? 'Global'}</span>
        )}
      </div>
    </div>
  );
}
