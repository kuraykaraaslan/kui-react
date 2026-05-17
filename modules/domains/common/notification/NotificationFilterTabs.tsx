'use client';
import { cn } from '@/libs/utils/cn';

type NotificationFilterTab = {
  id: string;
  label: string;
  count?: number;
};

type NotificationFilterTabsProps = {
  tabs: NotificationFilterTab[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
};

export function NotificationFilterTabs({
  tabs,
  activeId,
  onChange,
  className,
}: NotificationFilterTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Notification filters"
      className={cn(
        'flex flex-wrap items-center gap-1 border-b border-border pb-3',
        className,
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
              isActive
                ? 'bg-primary text-primary-fg'
                : 'bg-surface-overlay text-text-secondary hover:text-text-primary hover:bg-surface-sunken',
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.5 text-[10px] tabular-nums',
                  isActive ? 'bg-primary-fg/20' : 'bg-surface-base text-text-secondary',
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
