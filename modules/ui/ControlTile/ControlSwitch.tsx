'use client';
import { useId } from 'react';
import { Toggle } from '../Toggle';
import { useAsyncControl } from '@/libs/hooks/useAsyncControl';
import { ControlTile, type ControlMessages } from './ControlTile';
import { asBoolean } from './control-logic';

export type ControlSwitchProps = {
  title?: string;
  /** The bound state. Anything `asBoolean` cannot read is "unknown" and shows off. */
  value: unknown;
  /** The state the other side reports, if it reports one; "pending" lasts until it matches. */
  reported?: unknown;
  /** The write. Reject to fail and roll the thumb back. */
  onCommit: (next: boolean) => Promise<void>;
  onLabel?: string;
  offLabel?: string;
  unknownLabel?: string;
  /** The user may not use the control. */
  readOnly?: boolean;
  disabled?: boolean;
  timeoutMs?: number;
  messages?: Partial<ControlMessages>;
  className?: string;
};

/** ControlSwitch — a bound boolean written on toggle; shows the requested value while pending, rolls back on failure. */
export function ControlSwitch({
  title, value, reported, onCommit, onLabel = 'On', offLabel = 'Off', unknownLabel = 'State unknown',
  readOnly = false, disabled = false, timeoutMs, messages, className,
}: ControlSwitchProps) {
  const id = useId();
  const bound = asBoolean(value);
  const rep = reported === undefined ? undefined : asBoolean(reported);
  const ctl = useAsyncControl<boolean>({ value: bound, reported: rep, commit: onCommit, timeoutMs });
  const shown = ctl.displayValue ?? false;
  const hintId = `${id}-hint`;
  return (
    <ControlTile title={title} state={ctl.state} error={ctl.error} readOnly={readOnly} onRetry={ctl.retry} messages={messages} className={className}>
      <div className="flex items-center gap-3">
        <Toggle
          id={id}
          label={shown ? onLabel : offLabel}
          ariaLabel={title}
          checked={shown}
          onChange={ctl.set}
          pending={ctl.state === 'pending'}
          mismatch={ctl.state === 'mismatch'}
          describedBy={bound === null ? hintId : undefined}
          disabled={disabled || readOnly}
        />
        {bound === null && <span id={hintId} className="text-xs text-text-secondary">{unknownLabel}</span>}
      </div>
    </ControlTile>
  );
}
