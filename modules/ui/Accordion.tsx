'use client';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useId, useState } from 'react';

export type AccordionItem = {
  id: string;
  title: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
};

type AccordionProps = {
  items: AccordionItem[];
  defaultOpenIds?: string[];
  openIds?: string[];
  onChange?: (openIds: string[]) => void;
  allowMultiple?: boolean;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>;

export function Accordion({
  items,
  defaultOpenIds = [],
  openIds: controlledOpenIds,
  onChange,
  allowMultiple = false,
  className,
  ...rest
}: AccordionProps) {
  const [uncontrolledOpenIds, setUncontrolledOpenIds] = useState<string[]>(defaultOpenIds);
  const openIds = controlledOpenIds ?? uncontrolledOpenIds;
  const baseId = useId();

  function toggle(id: string) {
    const next = openIds.includes(id)
      ? openIds.filter((x) => x !== id)
      : allowMultiple
        ? [...openIds, id]
        : [id];
    setUncontrolledOpenIds(next);
    onChange?.(next);
  }

  return (
    <div className={cn('divide-y divide-border rounded-lg border border-border bg-surface-base', className)} {...rest}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        const headerId = `${baseId}-${item.id}-header`;
        const panelId = `${baseId}-${item.id}-panel`;
        return (
          <div key={item.id}>
            <h3 className="m-0">
              <button
                type="button"
                id={headerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                disabled={item.disabled}
                onClick={() => toggle(item.id)}
                className={cn(
                  'flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium text-text-primary transition-colors',
                  'hover:bg-surface-overlay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-inset',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                <span>{item.title}</span>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  aria-hidden="true"
                  className={cn('h-3.5 w-3.5 shrink-0 text-text-secondary transition-transform duration-200', isOpen && 'rotate-180')}
                />
              </button>
            </h3>
            <div id={panelId} role="region" aria-labelledby={headerId} hidden={!isOpen} className="px-4 pb-4 text-sm text-text-secondary">
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
