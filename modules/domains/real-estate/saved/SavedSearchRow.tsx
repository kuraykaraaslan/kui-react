'use client';
import { cn } from '@/libs/utils/cn';
import { Badge } from '@/modules/ui/Badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faBellSlash, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/modules/ui/Button';

type SavedSearchCriteria = {
  label: string;
};

type SavedSearchRowProps = {
  name: string;
  criteria: SavedSearchCriteria[];
  newCount?: number;
  alertsEnabled?: boolean;
  onToggleAlerts?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
};

export function SavedSearchRow({
  name,
  criteria,
  newCount = 0,
  alertsEnabled,
  onToggleAlerts,
  onEdit,
  onDelete,
  className,
}: SavedSearchRowProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-lg border border-border bg-surface-raised p-4 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-sm font-semibold text-text-primary">{name}</h3>
          {newCount > 0 && (
            <Badge variant="primary" size="sm">{newCount} new</Badge>
          )}
        </div>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {criteria.map((c, i) => (
            <span
              key={i}
              className="rounded-full bg-surface-overlay px-2 py-0.5 text-[11px] text-text-secondary"
            >
              {c.label}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {onToggleAlerts && (
          <Button
            type="button"
            variant={alertsEnabled ? 'primary' : 'outline'}
            size="sm"
            iconOnly
            onClick={onToggleAlerts}
            aria-label={alertsEnabled ? 'Disable alerts' : 'Enable alerts'}
          >
            <FontAwesomeIcon icon={alertsEnabled ? faBell : faBellSlash} className="w-3.5 h-3.5" aria-hidden="true" />
          </Button>
        )}
        {onEdit && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            iconOnly
            onClick={onEdit}
            aria-label="Edit search"
          >
            <FontAwesomeIcon icon={faPenToSquare} className="w-3.5 h-3.5" aria-hidden="true" />
          </Button>
        )}
        {onDelete && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            iconOnly
            onClick={onDelete}
            aria-label="Delete search"
            className="text-error hover:bg-error-subtle"
          >
            <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" aria-hidden="true" />
          </Button>
        )}
      </div>
    </div>
  );
}
