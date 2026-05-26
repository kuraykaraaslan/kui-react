'use client';
// modules/ui/Toast/parts/ToastItem.tsx
//
// Single toast card. Owns its own enter/exit animation, countdown timer,
// hover-to-pause and tab-hidden pause. M1 keeps the same DOM/Tailwind
// surface as the pre-split implementation so existing snapshots stay green.

import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleCheck,
  faTriangleExclamation,
  faCircleXmark,
  faCircleInfo,
  faSpinner,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import type { ToastItem as ToastItemT, ToastPosition, ToastVariant } from '../types';
import { getEffectiveDuration } from '../hooks/useToastStore';
import { ProgressBar } from './ProgressBar';

// ─── Variant config ─────────────────────────────────────────────────────────

type VariantConfig = {
  container: string;
  iconColor: string;
  progressColor: string;
  defaultIcon: React.ReactNode;
};

const variantMap: Record<ToastVariant, VariantConfig> = {
  success: {
    container:     'bg-success-subtle border-success',
    iconColor:     'text-success-fg',
    progressColor: 'bg-success',
    defaultIcon:   <FontAwesomeIcon icon={faCircleCheck} className="size-4 shrink-0" />,
  },
  warning: {
    container:     'bg-warning-subtle border-warning',
    iconColor:     'text-warning',
    progressColor: 'bg-warning',
    defaultIcon:   <FontAwesomeIcon icon={faTriangleExclamation} className="size-4 shrink-0" />,
  },
  error: {
    container:     'bg-error-subtle border-error',
    iconColor:     'text-error',
    progressColor: 'bg-error',
    defaultIcon:   <FontAwesomeIcon icon={faCircleXmark} className="size-4 shrink-0" />,
  },
  info: {
    container:     'bg-info-subtle border-info',
    iconColor:     'text-info',
    progressColor: 'bg-info',
    defaultIcon:   <FontAwesomeIcon icon={faCircleInfo} className="size-4 shrink-0" />,
  },
  loading: {
    container:     'bg-surface-raised border-border',
    iconColor:     'text-text-secondary',
    progressColor: 'bg-primary',
    defaultIcon:   <FontAwesomeIcon icon={faSpinner} className="size-4 shrink-0 animate-spin" />,
  },
};

// ─── ARIA mapping ───────────────────────────────────────────────────────────
//
// info / success → role="status"  + aria-live="polite"
// warning / error → role="alert"  + aria-live="assertive"
// loading mirrors info (status/polite) — promise() will swap variants on
// resolution and the live-region will re-announce automatically.

function ariaFor(variant: ToastVariant): { role: 'status' | 'alert'; live: 'polite' | 'assertive' } {
  if (variant === 'warning' || variant === 'error') return { role: 'alert', live: 'assertive' };
  return { role: 'status', live: 'polite' };
}

// ─── Card ───────────────────────────────────────────────────────────────────

const TICK_MS = 50;
const EXIT_MS = 250;

export type ToastItemProps = {
  item: ToastItemT;
  onRemove: () => void;
  /** Reduced-motion: skip enter/exit transitions. */
  reducedMotion?: boolean;
  /** Toaster position — passed through so M3 swipe-dismiss can pick its axis. */
  position?: ToastPosition;
};

export function ToastItem({ item, onRemove, reducedMotion = false }: ToastItemProps) {
  // TODO M3: useSwipeDismiss({ ref: cardRef, onDismiss: dismiss, position, disabled: reducedMotion });
  const duration = getEffectiveDuration(item);
  const hasDuration = duration !== null;

  const [progress, setProgress] = useState(100);
  const [paused, setPaused]     = useState(false);
  const [show, setShow]         = useState(reducedMotion);
  const [exiting, setExiting]   = useState(false);

  const remainingRef = useRef(duration ?? 0);
  const lastTickRef  = useRef(0);

  // Enter animation
  useEffect(() => {
    if (reducedMotion) return;
    const id = requestAnimationFrame(() => setShow(true));
    return () => cancelAnimationFrame(id);
  }, [reducedMotion]);

  const dismiss = useCallback(() => {
    setExiting(true);
    setTimeout(onRemove, reducedMotion ? 0 : EXIT_MS);
  }, [onRemove, reducedMotion]);

  // Countdown tick
  useEffect(() => {
    if (!hasDuration || paused || exiting) return;
    lastTickRef.current = Date.now();
    const id = setInterval(() => {
      const elapsed = Date.now() - lastTickRef.current;
      lastTickRef.current = Date.now();
      remainingRef.current = Math.max(0, remainingRef.current - elapsed);
      setProgress((remainingRef.current / duration!) * 100);
      if (remainingRef.current <= 0) {
        clearInterval(id);
        dismiss();
      }
    }, TICK_MS);
    return () => clearInterval(id);
  }, [hasDuration, paused, exiting, duration, dismiss]);

  // Pause when browser tab loses focus
  useEffect(() => {
    if (!hasDuration) return;
    const handler = () => setPaused(document.hidden);
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, [hasDuration]);

  // Re-sync remaining when duration changes (e.g. loading → success via promise()).
  useEffect(() => {
    remainingRef.current = duration ?? 0;
    setProgress(100);
    setExiting(false);
  }, [duration]);

  const { container, iconColor, progressColor, defaultIcon } = variantMap[item.variant];
  const icon = item.icon ?? defaultIcon;
  const showClose = item.closeButton !== false;
  const { role, live } = ariaFor(item.variant);

  return (
    <div
      role={role}
      aria-live={live}
      onMouseEnter={() => hasDuration && setPaused(true)}
      onMouseLeave={() => hasDuration && setPaused(false)}
      className={cn(
        'relative w-80 rounded-xl border shadow-lg overflow-hidden pointer-events-auto',
        reducedMotion ? '' : 'transition-all duration-250 ease-out',
        show && !exiting ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-3 scale-95',
        container,
      )}
    >
      {/* Body */}
      <div className="flex items-start gap-3 px-4 pt-4 pb-3">
        {/* Icon */}
        <span className={cn('mt-0.5', iconColor)} aria-hidden="true">{icon}</span>

        {/* Text */}
        <div className="flex-1 min-w-0">
          {item.title && (
            <p className="text-sm font-semibold text-text-primary leading-snug">{item.title}</p>
          )}
          <p className={cn('text-sm text-text-secondary leading-snug', item.title && 'mt-0.5')}>
            {item.message}
          </p>

          {/* Actions */}
          {item.actions && item.actions.length > 0 && (
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2.5">
              {item.actions.map((action, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => action.onClick(dismiss)}
                  className={cn(
                    'text-xs font-semibold rounded transition-opacity hover:opacity-70',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
                    action.variant === 'danger'
                      ? 'text-error'
                      : 'text-text-primary underline underline-offset-2',
                  )}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Close */}
        {showClose && (
          <button
            type="button"
            aria-label="Dismiss"
            onClick={dismiss}
            className={cn(
              'shrink-0 mt-0.5 rounded text-text-secondary hover:text-text-primary transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
            )}
          >
            <FontAwesomeIcon icon={faXmark} className="size-3.5" />
          </button>
        )}
      </div>

      {/* Progress bar */}
      {hasDuration && <ProgressBar progress={progress} colorClass={progressColor} />}
    </div>
  );
}
