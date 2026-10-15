'use client';
import type { ReactNode } from 'react';
import { cn } from '@/libs/utils/cn';
import { Tooltip } from '../Tooltip';
import type { AsyncControlState } from '@/libs/hooks/useAsyncControl';

export type ControlMessages = {
  pending: string;
  confirmed: string;
  mismatch: string;
  failed: string;
  readOnly: string;
  retry: string;
};

export const DEFAULT_CONTROL_MESSAGES: ControlMessages = {
  pending: 'Sending…',
  confirmed: 'Done',
  mismatch: 'The device reports a different value.',
  failed: 'The change failed.',
  readOnly: 'You do not have permission to use this control.',
  retry: 'Retry',
};

export type ControlTileProps = {
  title?: string;
  state: AsyncControlState;
  /** Failure text; falls back to `messages.failed`. */
  error?: string | null;
  /** Show the read-only notice (the user may not use the control). */
  readOnly?: boolean;
  /** The value the other side reports, shown as a quiet line under the control. */
  reportedText?: string;
  /** Wired to the state line's "Retry" button on failure / mismatch. Omit to hide the button. */
  onRetry?: () => void;
  messages?: Partial<ControlMessages>;
  /**
   * Draw the tile's own frame (border, background, padding). Default `true`. Pass `false` when
   * the control sits inside a host card (e.g. a dashboard `WidgetCard`) that already frames it.
   */
  framed?: boolean;
  /**
   * Why the control is disabled (no command, old data, unknown state …). Shown in a tooltip over
   * the control (its text stays in the accessibility tree). The control itself must also be disabled.
   */
  disabledReason?: string;
  children: ReactNode;
  className?: string;
};

/**
 * ControlTile — the frame every async control shares: title, the control slot, and one
 * live status line (pending / confirmed / mismatch / failed / read-only). One place, so
 * the controls cannot drift on what "pending" or "failed" looks like.
 */
export function ControlTile({
  title, state, error, readOnly, reportedText, onRetry, messages, framed = true, disabledReason, children, className,
}: ControlTileProps) {
  const m = { ...DEFAULT_CONTROL_MESSAGES, ...messages };
  return (
    <div
      className={cn(framed ? 'rounded-lg border border-border bg-surface-raised p-3' : 'flex h-full min-h-0 flex-col', className)}
      data-disabled-reason={disabledReason || undefined}
    >
      {title && <h3 className="mb-2 text-sm font-semibold text-text-primary">{title}</h3>}
      <div className={cn('space-y-2', !framed && 'flex min-h-0 flex-1 flex-col justify-center')}>
        {disabledReason ? (
          <Tooltip content={disabledReason} className="flex w-full [&>span:first-child]:min-w-0 [&>span:first-child]:flex-1">
            {children}
          </Tooltip>
        ) : children}
        {reportedText && <p className="text-xs text-text-secondary">{reportedText}</p>}
        <div className="flex min-h-5 items-center gap-2 text-xs" aria-live="polite">
          {state === 'pending' && (
            <>
              <span aria-hidden="true" className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-border border-t-primary motion-reduce:animate-none" />
              <span className="text-text-secondary">{m.pending}</span>
            </>
          )}
          {state === 'confirmed' && <span className="text-success">{m.confirmed}</span>}
          {state === 'mismatch' && <span className="text-warning">{m.mismatch}</span>}
          {state === 'failed' && <span role="alert" className="text-error">{error || m.failed}</span>}
          {(state === 'failed' || state === 'mismatch') && onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="rounded-sm text-primary underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
            >
              {m.retry}
            </button>
          )}
          {readOnly && state === 'idle' && <span className="text-text-secondary">{m.readOnly}</span>}
        </div>
      </div>
    </div>
  );
}
