'use client';
import { useState, type CSSProperties, type ReactNode } from 'react';
import { cn } from '@/libs/utils/cn';
import { Button } from '../Button';
import { useAsyncControl } from '@/libs/hooks/useAsyncControl';
import { ControlTile, type ControlMessages } from './ControlTile';
import { ControlConfirmPrompt, DEFAULT_CONFIRM_MESSAGES, type ControlConfirmation, type ControlConfirmMessages } from './ControlConfirm';

export type { ControlConfirmation } from './ControlConfirm';

export type ControlButtonMessages = ControlConfirmMessages & {
  run: string;
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
  /** Why it is disabled; shown in a tooltip. Implies `disabled`. */
  disabledReason?: string;
  /** `button` (default): a button. `tile`: a large pressable area with the icon above the label. */
  layout?: 'button' | 'tile';
  /** An icon before the label (above it in a tile). */
  icon?: ReactNode;
  /** Button style. Default `primary`. */
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  /** Inline style of the main button (colours from settings data, radius, font). */
  buttonStyle?: CSSProperties;
  buttonClassName?: string;
  /** Draw the tile frame. Default `true`. */
  framed?: boolean;
  messages?: Partial<ControlMessages & ControlButtonMessages>;
  className?: string;
};

const DEFAULTS: ControlButtonMessages = { ...DEFAULT_CONFIRM_MESSAGES, run: 'Run' };

/** ControlButton — one press fires `onCommit`; an optional confirm / typed-confirm step comes first. */
export function ControlButton({
  title, label, onCommit, confirm = 'none', confirmText = '', readOnly = false, disabled = false, disabledReason,
  layout = 'button', icon, variant = 'primary', size = 'md', fullWidth = false, buttonStyle, buttonClassName, framed = true,
  messages, className,
}: ControlButtonProps) {
  const m = { ...DEFAULTS, ...messages };
  const [asking, setAsking] = useState(false);
  const ctl = useAsyncControl<ControlConfirmation | undefined>({
    value: undefined,
    commit: (c) => onCommit(c),
    confirmedMs: 2000,
  });
  const pending = ctl.state === 'pending';

  const fire = (typed?: string) => {
    ctl.set(confirm === 'none' ? undefined : { confirmed: true, ...(confirm === 'typed' ? { typed } : {}) });
    setAsking(false);
  };

  return (
    <ControlTile
      title={title}
      state={ctl.state}
      error={ctl.error}
      readOnly={readOnly}
      onRetry={ctl.retry}
      messages={messages}
      framed={framed}
      disabledReason={disabledReason}
      className={className}
    >
      {!asking ? (
        <Button
          variant={variant}
          size={layout === 'tile' ? 'lg' : size}
          fullWidth={fullWidth || layout === 'tile'}
          onClick={() => (confirm === 'none' ? fire() : setAsking(true))}
          disabled={disabled || readOnly || !!disabledReason || pending}
          loading={pending && layout !== 'tile'}
          aria-busy={pending || undefined}
          iconLeft={layout === 'button' ? icon : undefined}
          style={buttonStyle}
          className={cn(layout === 'tile' && 'min-h-24 flex-col gap-2 py-4', buttonClassName)}
        >
          {layout === 'tile' && icon && <span aria-hidden="true" className="inline-flex items-center">{icon}</span>}
          {label || m.run}
        </Button>
      ) : (
        <ControlConfirmPrompt
          mode={confirm === 'typed' ? 'typed' : 'confirm'}
          confirmText={confirmText}
          onConfirm={fire}
          onCancel={() => setAsking(false)}
          messages={m}
        />
      )}
    </ControlTile>
  );
}
