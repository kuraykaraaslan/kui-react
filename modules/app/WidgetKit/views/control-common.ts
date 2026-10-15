// Shared by the control views: why a control is disabled, and how it asks its host to act.
// Controls never decide what is written: they hand `{ kind, value }` to `onControl` and the host's
// command (checked on the server) does the rest.

import type { ControlConfirm, ControlRequest, WidgetViewProps } from '../kind';

export const CONTROL_REASONS = {
  notConnected: 'Not connected: no command is set for this control.',
  stale: 'The reading is old, so the control is disabled.',
  unknown: 'The current state is unknown, so the control is disabled.',
};

/**
 * The reason a control is disabled, or `undefined` when it may be used. The host's reason wins;
 * then a missing `onControl`; then the `disableWhen` setting (`stale`, `unknown`).
 */
export function controlBlockReason(
  props: Pick<WidgetViewProps, 'controlDisabledReason' | 'onControl' | 'stale'>,
  disableWhen: unknown,
  unknown: boolean,
): string | undefined {
  if (props.controlDisabledReason) return props.controlDisabledReason;
  if (!props.onControl) return CONTROL_REASONS.notConnected;
  const when = Array.isArray(disableWhen) ? disableWhen : [];
  if (when.includes('stale') && props.stale) return CONTROL_REASONS.stale;
  if (when.includes('unknown') && unknown) return CONTROL_REASONS.unknown;
  return undefined;
}

/** What the user confirmed, as the kui controls hand it over. */
export type Confirmation = { confirmed: true; typed?: string };

/**
 * A commit function for the kui controls: resolves when the host is done, rejects on failure.
 * A confirmed write also carries `confirmation` on the request (the host passes it to the server,
 * which checks the policy again).
 */
export function requestControl(onControl: WidgetViewProps['onControl'], kind: ControlRequest['kind']) {
  return async (value?: unknown, confirmation?: Confirmation): Promise<void> => {
    if (!onControl) throw new Error(CONTROL_REASONS.notConnected);
    const request: ControlRequest & { confirmation?: Confirmation } = kind === 'run' ? { kind } : { kind, value };
    if (confirmation) request.confirmation = confirmation;
    await onControl(request);
  };
}

/**
 * The command's confirmation policy as kui control props: `confirm` asks (its `text`, when given,
 * is the question); `typed` requires its `text` to be typed exactly.
 */
export function confirmProps(confirm: ControlConfirm | undefined): {
  confirm: 'none' | 'confirm' | 'typed';
  confirmText?: string;
  messages?: { confirmPrompt: string };
} {
  if (!confirm || confirm.mode === 'none') return { confirm: 'none' };
  if (confirm.mode === 'typed') return { confirm: 'typed', confirmText: confirm.text ?? '' };
  return { confirm: 'confirm', ...(confirm.text ? { messages: { confirmPrompt: confirm.text } } : {}) };
}

/** A text setting, or `undefined` when it is empty (so the control's own default applies). */
export const textOr = (v: unknown): string | undefined => (typeof v === 'string' && v.trim() ? v : undefined);
