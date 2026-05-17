'use client';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faReceipt,
  faUtensils,
  faBoxOpen,
  faMotorcycle,
  faHouseChimney,
  faCircleXmark,
} from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export type OrderTrackingStep = {
  key: 'PLACED' | 'PREPARING' | 'READY' | 'ON_THE_WAY' | 'DELIVERED' | 'CANCELLED';
  label: string;
  description?: string;
  occurredAt?: Date | string;
  isCurrent?: boolean;
};

type OrderTrackingTimelineProps = {
  steps: OrderTrackingStep[];
  className?: string;
};

const STEP_ICON: Record<OrderTrackingStep['key'], IconDefinition> = {
  PLACED: faReceipt,
  PREPARING: faUtensils,
  READY: faBoxOpen,
  ON_THE_WAY: faMotorcycle,
  DELIVERED: faHouseChimney,
  CANCELLED: faCircleXmark,
};

function timeLabel(date: Date | string): string {
  return new Date(date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export function OrderTrackingTimeline({ steps, className }: OrderTrackingTimelineProps) {
  return (
    <ol
      className={cn('rounded-xl border border-border bg-surface-raised p-5', className)}
      aria-label="Order progress"
    >
      {steps.map((step, idx) => {
        const isLast = idx === steps.length - 1;
        const isComplete = !!step.occurredAt && !step.isCurrent;
        const isCancelled = step.key === 'CANCELLED' && !!step.occurredAt;
        const isUpcoming = !step.occurredAt && !step.isCurrent;

        return (
          <li key={step.key} className="relative flex gap-4 pb-6 last:pb-0">
            {/* Connector */}
            {!isLast && (
              <span
                aria-hidden="true"
                className={cn(
                  'absolute left-[15px] top-8 bottom-0 w-px',
                  isComplete ? 'bg-success' : 'bg-border',
                )}
              />
            )}

            {/* Dot */}
            <span
              className={cn(
                'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-4 ring-surface-raised',
                isCancelled
                  ? 'bg-error text-white'
                  : isComplete
                    ? 'bg-success text-white'
                    : step.isCurrent
                      ? 'bg-primary text-primary-fg animate-pulse'
                      : 'bg-surface-overlay text-text-disabled',
              )}
              aria-hidden="true"
            >
              <FontAwesomeIcon
                icon={isComplete ? faCheck : STEP_ICON[step.key]}
                className="w-3.5 h-3.5"
              />
            </span>

            <div className={cn('min-w-0 flex-1 pt-0.5', isUpcoming && 'opacity-60')}>
              <div className="flex items-baseline justify-between gap-2">
                <p className={cn(
                  'text-sm font-semibold',
                  isCancelled ? 'text-error' : 'text-text-primary',
                )}>
                  {step.label}
                </p>
                {step.occurredAt && (
                  <time
                    className="shrink-0 text-xs text-text-secondary tabular-nums"
                    dateTime={new Date(step.occurredAt).toISOString()}
                  >
                    {timeLabel(step.occurredAt)}
                  </time>
                )}
              </div>
              {step.description && (
                <p className="mt-0.5 text-xs text-text-secondary leading-relaxed">{step.description}</p>
              )}
              {step.isCurrent && (
                <p className="mt-1 text-xs font-medium text-primary">In progress…</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
