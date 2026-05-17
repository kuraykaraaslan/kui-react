'use client';
import { DropdownMenu, type DropdownItem } from '@/modules/ui/DropdownMenu';
import { Button } from '@/modules/ui/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEllipsisVertical,
  faSnowflake,
  faSun,
  faKey,
  faSliders,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';

type CardActionMenuProps = {
  status: 'active' | 'frozen' | 'expired';
  onFreeze?: () => void;
  onUnfreeze?: () => void;
  onShowDetails?: () => void;
  onUpdateLimits?: () => void;
  onDelete?: () => void;
  className?: string;
};

export function CardActionMenu({
  status,
  onFreeze,
  onUnfreeze,
  onShowDetails,
  onUpdateLimits,
  onDelete,
  className,
}: CardActionMenuProps) {
  const items: DropdownItem[] = [];

  if (status === 'active' && onFreeze) {
    items.push({
      label: 'Freeze card',
      icon: <FontAwesomeIcon icon={faSnowflake} className="w-3 h-3" aria-hidden="true" />,
      onClick: onFreeze,
    });
  }
  if (status === 'frozen' && onUnfreeze) {
    items.push({
      label: 'Unfreeze card',
      icon: <FontAwesomeIcon icon={faSun} className="w-3 h-3" aria-hidden="true" />,
      onClick: onUnfreeze,
    });
  }
  if (onShowDetails) {
    items.push({
      label: 'Show card number',
      icon: <FontAwesomeIcon icon={faKey} className="w-3 h-3" aria-hidden="true" />,
      onClick: onShowDetails,
      disabled: status === 'expired',
    });
  }
  if (onUpdateLimits) {
    items.push({
      label: 'Update limits',
      icon: <FontAwesomeIcon icon={faSliders} className="w-3 h-3" aria-hidden="true" />,
      onClick: onUpdateLimits,
    });
  }
  if (onDelete) {
    items.push({ type: 'separator' });
    items.push({
      label: 'Delete card',
      icon: <FontAwesomeIcon icon={faTrash} className="w-3 h-3" aria-hidden="true" />,
      onClick: onDelete,
      danger: true,
    });
  }

  return (
    <DropdownMenu
      align="right"
      className={className}
      trigger={
        <Button variant="outline" size="sm" iconOnly aria-label="Card actions">
          <FontAwesomeIcon icon={faEllipsisVertical} className="w-3.5 h-3.5" aria-hidden="true" />
        </Button>
      }
      items={items}
    />
  );
}
