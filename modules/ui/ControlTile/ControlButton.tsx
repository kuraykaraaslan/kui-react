'use client';
import { useId, useState } from 'react';
import { Button } from '../Button';
import { useAsyncControl } from '@/libs/hooks/useAsyncControl';
import { ControlTile, type ControlMessages } from './ControlTile';

export type ControlConfirmation = { confirmed: true; typed?: string };

export type ControlButtonMessages = {
  run: string;
  confirmPrompt: string;
  confirm: string;
  cancel: string;
  /** `{text}` is replaced. */
  typeToConfirm: string;
};

export type ControlButtonProps = {
  title?: string;
  /** Button caption. Default = messages.run ("Run"). */
  label?: string;
  /** Fires the action. With a confirmation policy the argument carries the user's confirmation. Reject to fail. */
  onCommit: (confirmation?: ControlConfirmation) => Promise<void>;
  /** `confirm` asks "Are you sure?"; `typed` also requires `confirmText` to be typed. Default `none`. */
  confirm?: 'none' | 'confirm' | 'typed';
  /** The text to type when `confirm="typed"`. */
  confirmText?: string;
  readOnly?: boolean;
  disabled?: boolean;
  messages?: Partial<ControlMessages & ControlButtonMessages>;
  className?: string;
};

const DEFAULTS: ControlButtonMessages = {
  run: 'Run',
  confirmPrompt: 'Are you sure?',
  confirm: 'Confirm',
  cancel: 'Cancel',
  typeToConfirm: 'Type "{text}" to confirm',
};

/** ControlButton — one press fires `onCommit`; an optional confirm / typed-confirm step comes first. */
export function ControlButton({
  title, label, onCommit, confirm = 'none', confirmText = '', readOnly = false, disabled = false, messages, className,
}: ControlButtonProps) {
  const id = useId();
  const m = { ...DEFAULTS, ...messages };
  const [asking, setAsking] = useState(false);
  const [typed, setTyped] = useState('');
  const ctl = useAsyncControl<ControlConfirmation | undefined>({
    value: undefined,
    commit: (c) => onCommit(c),
    confirmedMs: 2000,
  });
  const pending = ctl.state === 'pending';

  const fire = () => {
    ctl.set(confirm === 'none' ? undefined : { confirmed: true, ...(confirm === 'typed' ? { typed } : {}) });
    setAsking(false);
    setTyped('');
  };

  return (
    <ControlTile title={title} state={ctl.state} error={ctl.error} readOnly={readOnly} onRetry={ctl.retry} messages={messages} className={className}>
      {!asking ? (
        <Button onClick={() => (confirm === 'none' ? fire() : setAsking(true))} disabled={disabled || readOnly || pending} loading={pending}>
          {label || m.run}
        </Button>
      ) : (
        <div className="space-y-2" role="group" aria-labelledby={`${id}-prompt`}>
          <p id={`${id}-prompt`} className="text-sm text-text-primary">{m.confirmPrompt}</p>
          {confirm === 'typed' && (
            <input
              aria-label={m.typeToConfirm.replace('{text}', confirmText)}
              placeholder={confirmText}
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              className="h-9 w-full rounded-md border border-border bg-surface-base px-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
            />
          )}
          <div className="flex gap-2">
            <Button onClick={fire} disabled={confirm === 'typed' && typed.trim() !== confirmText}>{m.confirm}</Button>
            <Button variant="secondary" onClick={() => { setAsking(false); setTyped(''); }}>{m.cancel}</Button>
          </div>
        </div>
      )}
    </ControlTile>
  );
}
