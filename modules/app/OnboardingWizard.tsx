'use client';
import { useState } from 'react';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/modules/ui/Button';
import { Modal } from '@/modules/ui/Modal';

export type OnboardingStep = {
  id: string;
  title: string;
  description?: string;
  content: React.ReactNode | ((ctx: { goNext: () => void; goPrev: () => void }) => React.ReactNode);
  optional?: boolean;
};

export type OnboardingWizardProps = {
  steps: OnboardingStep[];
  mode?: 'page' | 'modal';
  open?: boolean;
  initialStep?: number;
  title?: string;
  allowSkip?: boolean;
  onStepChange?: (index: number) => void;
  onComplete?: () => void | Promise<void>;
  onSkip?: () => void;
  onClose?: () => void;
  nextLabel?: string;
  prevLabel?: string;
  skipLabel?: string;
  completeLabel?: string;
  indicator?: 'dots' | 'bar';
  className?: string;
};

function ProgressBar({ value, total }: { value: number; total: number }) {
  const pct = total > 0 ? Math.min(100, Math.max(0, ((value + 1) / total) * 100)) : 0;
  return (
    <div
      className="h-1 w-full rounded-full bg-surface-sunken overflow-hidden"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={value + 1}
    >
      <div
        className="h-full bg-primary transition-[width] duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function ProgressDots({ value, total }: { value: number; total: number }) {
  return (
    <div
      className="flex items-center gap-2"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={value + 1}
    >
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={cn(
            'h-2 rounded-full transition-all',
            i === value ? 'w-6 bg-primary' : i < value ? 'w-2 bg-primary' : 'w-2 bg-surface-sunken',
          )}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export function OnboardingWizard({
  steps,
  mode = 'page',
  open = true,
  initialStep = 0,
  title = 'Welcome',
  allowSkip = true,
  onStepChange,
  onComplete,
  onSkip,
  onClose,
  nextLabel = 'Next',
  prevLabel = 'Back',
  skipLabel = 'Skip',
  completeLabel = 'Finish',
  indicator = 'dots',
  className,
}: OnboardingWizardProps) {
  const [current, setCurrent] = useState(Math.min(Math.max(initialStep, 0), steps.length - 1));
  const [completing, setCompleting] = useState(false);

  function setStep(next: number) {
    const clamped = Math.min(Math.max(next, 0), steps.length - 1);
    setCurrent(clamped);
    onStepChange?.(clamped);
  }

  function goNext() {
    setStep(current + 1);
  }

  function goPrev() {
    setStep(current - 1);
  }

  async function complete() {
    setCompleting(true);
    try {
      await onComplete?.();
    } finally {
      setCompleting(false);
    }
  }

  const step = steps[current];
  if (!step) return null;
  const isLast = current === steps.length - 1;
  const isFirst = current === 0;

  const body = (
    <div className={cn('flex flex-col gap-6', className)}>
      <div className="flex items-center gap-3">
        <span className="text-xs uppercase tracking-wide text-text-disabled font-medium shrink-0">
          {current + 1} / {steps.length}
        </span>
        <div className="flex-1">
          {indicator === 'bar' ? (
            <ProgressBar value={current} total={steps.length} />
          ) : (
            <ProgressDots value={current} total={steps.length} />
          )}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-text-primary">{step.title}</h2>
        {step.description && (
          <p className="mt-1 text-sm text-text-secondary">{step.description}</p>
        )}
      </div>

      <div className="min-h-[8rem]">
        {typeof step.content === 'function' ? step.content({ goNext, goPrev }) : step.content}
      </div>

      <div className="flex items-center justify-between gap-3 pt-4 border-t border-border">
        <div>
          {!isFirst && (
            <Button
              variant="outline"
              onClick={goPrev}
              iconLeft={
                <FontAwesomeIcon icon={faArrowLeft} className="w-3.5 h-3.5" aria-hidden="true" />
              }
            >
              {prevLabel}
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          {allowSkip && !isLast && (
            <Button
              variant="ghost"
              onClick={() => onSkip?.()}
              iconLeft={
                <FontAwesomeIcon icon={faXmark} className="w-3.5 h-3.5" aria-hidden="true" />
              }
            >
              {skipLabel}
            </Button>
          )}
          {isLast ? (
            <Button
              onClick={complete}
              loading={completing}
              iconLeft={
                <FontAwesomeIcon icon={faCheck} className="w-3.5 h-3.5" aria-hidden="true" />
              }
            >
              {completeLabel}
            </Button>
          ) : (
            <Button
              onClick={goNext}
              iconRight={
                <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5" aria-hidden="true" />
              }
            >
              {nextLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  if (mode === 'modal') {
    return (
      <Modal
        open={open}
        onClose={onClose ?? (() => undefined)}
        title={title}
        size="lg"
        closeOnBackdropClick={false}
      >
        {body}
      </Modal>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl rounded-xl border border-border bg-surface-raised p-6 shadow-sm">
      {body}
    </div>
  );
}
