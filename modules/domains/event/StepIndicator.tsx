'use client';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

export type CheckoutStep = 'tickets' | 'buyer' | 'payment' | 'confirm';

const STEPS: { id: CheckoutStep; label: string }[] = [
  { id: 'tickets', label: 'Biletler' },
  { id: 'buyer', label: 'Bilgiler' },
  { id: 'payment', label: 'Ödeme' },
  { id: 'confirm', label: 'Onay' },
];

type StepIndicatorProps = { current: CheckoutStep };

export function StepIndicator({ current }: StepIndicatorProps) {
  const currentIdx = STEPS.findIndex((s) => s.id === current);

  return (
    <div className="flex items-center gap-0">
      {STEPS.map((step, i) => {
        const done = i < currentIdx;
        const active = i === currentIdx;
        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors',
                  done
                    ? 'bg-success text-white'
                    : active
                      ? 'bg-primary text-primary-fg'
                      : 'bg-surface-overlay text-text-disabled border border-border',
                )}
              >
                {done ? <FontAwesomeIcon icon={faCheck} className="w-3 h-3" aria-hidden="true" /> : i + 1}
              </div>
              <span
                className={cn(
                  'text-[10px] font-medium whitespace-nowrap',
                  active ? 'text-primary' : done ? 'text-text-secondary' : 'text-text-disabled',
                )}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn('h-px w-12 sm:w-16 mb-4 transition-colors', done ? 'bg-success' : 'bg-border')} />
            )}
          </div>
        );
      })}
    </div>
  );
}
