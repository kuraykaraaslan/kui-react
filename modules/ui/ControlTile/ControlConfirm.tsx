'use client';
import { useId, useRef, useState } from 'react';
import { Button } from '../Button';

/** What a confirmed write carries to `onCommit`, so the other side can check it again. */
export type ControlConfirmation = { confirmed: true; typed?: string };

/** `confirm` asks "Are you sure?"; `typed` also requires `confirmText` to be typed exactly. */
export type ControlConfirmMode = 'none' | 'confirm' | 'typed';

export type ControlConfirmMessages = {
  confirmPrompt: string;
  confirm: string;
  cancel: string;
  /** `{text}` is replaced. */
  typeToConfirm: string;
};

export const DEFAULT_CONFIRM_MESSAGES: ControlConfirmMessages = {
  confirmPrompt: 'Are you sure?',
  confirm: 'Confirm',
  cancel: 'Cancel',
  typeToConfirm: 'Type "{text}" to confirm',
};

/**
 * Park a requested value behind a confirmation step. `request(value)` returns the value to write
 * now (mode `none`) or parks it and returns `undefined`; `accept(typed)` returns the parked value
 * (to write) and records its confirmation in `confirmation`; `cancel` drops it.
 */
export function useControlConfirm<T>(mode: ControlConfirmMode) {
  const [asking, setAsking] = useState<{ value: T } | null>(null);
  const confirmation = useRef<ControlConfirmation | undefined>(undefined);
  const request = (value: T): { value: T } | undefined => {
    if (mode === 'none') { confirmation.current = undefined; return { value }; }
    setAsking({ value });
    return undefined;
  };
  const accept = (typed?: string): { value: T } | undefined => {
    if (!asking) return undefined;
    confirmation.current = { confirmed: true, ...(mode === 'typed' ? { typed } : {}) };
    setAsking(null);
    return asking;
  };
  const cancel = () => setAsking(null);
  return { asking, request, accept, cancel, confirmation };
}

export type ControlConfirmPromptProps = {
  mode: Exclude<ControlConfirmMode, 'none'>;
  /** The text to type when `mode="typed"`. */
  confirmText?: string;
  onConfirm: (typed?: string) => void;
  onCancel: () => void;
  messages?: Partial<ControlConfirmMessages>;
};

/** The "Are you sure?" step every control shares; `typed` enables Confirm only on the exact text. */
export function ControlConfirmPrompt({ mode, confirmText = '', onConfirm, onCancel, messages }: ControlConfirmPromptProps) {
  const id = useId();
  const m = { ...DEFAULT_CONFIRM_MESSAGES, ...messages };
  const [typed, setTyped] = useState('');
  const ok = mode !== 'typed' || typed.trim() === confirmText;
  return (
    <div className="space-y-2" role="group" aria-labelledby={`${id}-prompt`}>
      <p id={`${id}-prompt`} className="text-sm text-text-primary">{m.confirmPrompt}</p>
      {mode === 'typed' && (
        <input
          aria-label={m.typeToConfirm.replace('{text}', confirmText)}
          placeholder={confirmText}
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          className="h-9 w-full rounded-md border border-border bg-surface-base px-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
        />
      )}
      <div className="flex gap-2">
        <Button onClick={() => onConfirm(mode === 'typed' ? typed.trim() : undefined)} disabled={!ok}>{m.confirm}</Button>
        <Button variant="secondary" onClick={onCancel}>{m.cancel}</Button>
      </div>
    </div>
  );
}
