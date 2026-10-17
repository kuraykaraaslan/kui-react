'use client';
import type { ReactNode } from 'react';
import { cn } from '@/libs/utils/cn';
import { Badge } from './Badge';
import { Button } from './Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faPowerOff,
  faGem,
  faBan,
  faBoxArchive,
  faGavel,
  faShieldHalved,
  faTriangleExclamation,
  faPuzzlePiece,
  faLock,
} from '@fortawesome/free-solid-svg-icons';

/** Why a contribution cannot be shown. */
export type UnavailableReason =
  | 'disabled'
  | 'unentitled'
  | 'blocked'
  | 'retired'
  | 'banned'
  | 'quarantined'
  | 'failed'
  | 'missing'
  | 'no-access';

/** Where the placeholder sits: a line in a bar or menu, a card body, a tab panel, an editor node or block. */
export type UnavailableContributionSize = 'inline' | 'card' | 'tab' | 'node';

/** Same names as the `Badge` variants it uses. */
export type UnavailableTone = 'neutral' | 'primary' | 'info' | 'warning' | 'error';

export type UnavailableContributionAction = {
  label: string;
  onClick?: () => void;
  /** Renders the action as a link. */
  href?: string;
  icon?: ReactNode;
};

export type UnavailableReasonMeta = {
  icon: IconDefinition;
  tone: UnavailableTone;
  /** Short text, shown as the heading or in the reason badge. */
  label: string;
  /** One sentence explaining the reason. */
  detail: string;
};

/** Default icon, tone and English texts per reason. Hosts override the texts per instance for i18n. */
export const UNAVAILABLE_REASONS: Record<UnavailableReason, UnavailableReasonMeta> = {
  disabled:    { icon: faPowerOff,            tone: 'neutral', label: 'Disabled',       detail: 'The module that provides this is turned off.' },
  unentitled:  { icon: faGem,                 tone: 'primary', label: 'Not in plan',    detail: 'Your current plan does not include this.' },
  blocked:     { icon: faBan,                 tone: 'warning', label: 'Blocked',        detail: 'An administrator has blocked this.' },
  retired:     { icon: faBoxArchive,          tone: 'neutral', label: 'Retired',        detail: 'This is no longer offered.' },
  banned:      { icon: faGavel,               tone: 'error',   label: 'Banned',         detail: 'This was banned and can no longer run.' },
  quarantined: { icon: faShieldHalved,        tone: 'warning', label: 'Quarantined',    detail: 'Paused automatically after repeated errors.' },
  failed:      { icon: faTriangleExclamation, tone: 'error',   label: 'Failed to load', detail: 'Something went wrong while showing this.' },
  missing:     { icon: faPuzzlePiece,         tone: 'neutral', label: 'Missing',        detail: 'What provided this is not installed.' },
  'no-access': { icon: faLock,                tone: 'neutral', label: 'No access',      detail: 'You do not have permission to see this.' },
};

export const UNAVAILABLE_REASON_IDS = Object.keys(UNAVAILABLE_REASONS) as UnavailableReason[];

/** The content of a placeholder, without where it sits. Hosts (e.g. `WidgetCard`) pass this through. */
export type UnavailableContributionContent = {
  reason: UnavailableReason;
  /** What is unavailable (e.g. the contribution's name). The reason then shows as a badge. */
  title?: string;
  /** Overrides the reason's short text. */
  label?: string;
  /** Overrides the reason's explanation; `null` hides it. */
  detail?: string | null;
  /** Overrides the reason's icon. */
  icon?: ReactNode;
  /** Overrides the reason's tone. */
  tone?: UnavailableTone;
  /** What the viewer can do about it: enable, upgrade, retry, remove the reference. */
  action?: UnavailableContributionAction;
};

export type UnavailableContributionProps = UnavailableContributionContent & {
  size?: UnavailableContributionSize;
  /** Draw the dashed placeholder frame (`card` and `node`). Turn off inside a host that has its own frame. */
  framed?: boolean;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'title' | 'children'>;

const TONE_TEXT: Record<UnavailableTone, string> = {
  neutral: 'text-text-secondary',
  primary: 'text-primary',
  info: 'text-info',
  warning: 'text-warning',
  error: 'text-error',
};

const ICON_SIZE: Record<UnavailableContributionSize, string> = {
  inline: 'h-3 w-3',
  node: 'h-3.5 w-3.5',
  card: 'h-4 w-4',
  tab: 'h-5 w-5',
};

function ActionButton({
  action,
  size,
  variant,
  className,
}: {
  action: UnavailableContributionAction;
  size: 'xs' | 'sm';
  variant: 'ghost' | 'outline';
  className?: string;
}) {
  if (action.href) {
    return (
      <Button as="a" href={action.href} onClick={action.onClick} variant={variant} size={size} iconLeft={action.icon} className={className}>
        {action.label}
      </Button>
    );
  }
  return (
    <Button variant={variant} size={size} onClick={action.onClick} iconLeft={action.icon} className={className}>
      {action.label}
    </Button>
  );
}

/**
 * What an admin or editor sees where a contribution cannot be shown: the reason (icon, tone,
 * short text), an explanation and an optional action. End users should see nothing instead —
 * the host decides who gets the placeholder.
 */
export function UnavailableContribution({
  reason,
  size = 'card',
  title,
  label,
  detail,
  icon,
  tone,
  action,
  framed,
  className,
  ...rest
}: UnavailableContributionProps) {
  const meta = UNAVAILABLE_REASONS[reason] ?? UNAVAILABLE_REASONS.missing;
  const toneKey = tone ?? meta.tone;
  const text = label ?? meta.label;
  const description = detail === undefined ? meta.detail : detail;
  const glyph = icon ?? <FontAwesomeIcon icon={meta.icon} className={ICON_SIZE[size]} aria-hidden="true" />;
  const common = { role: 'note', 'data-reason': reason, 'data-size': size, ...rest };

  if (size === 'inline') {
    return (
      <div
        {...common}
        title={description || undefined}
        className={cn('inline-flex max-w-full items-center gap-2 align-middle text-xs', className)}
      >
        <Badge variant={toneKey} size="md" className="shrink-0">
          <span aria-hidden="true" className="inline-flex">{glyph}</span>
          {text}
        </Badge>
        {title && <span className="min-w-0 truncate font-medium text-text-primary">{title}</span>}
        {description && <span className="sr-only">{description}</span>}
        {action && <ActionButton action={action} size="xs" variant="ghost" />}
      </div>
    );
  }

  const iconTile = (
    <div
      aria-hidden="true"
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full bg-surface-sunken',
        size === 'node' ? 'h-8 w-8' : size === 'tab' ? 'mb-4 h-12 w-12' : 'mb-3 h-10 w-10',
        TONE_TEXT[toneKey],
      )}
    >
      {glyph}
    </div>
  );
  const heading = title ?? text;
  const reasonBadge = title ? <Badge variant={toneKey} size="sm">{text}</Badge> : null;

  if (size === 'node') {
    return (
      <div
        {...common}
        className={cn(
          'flex w-full min-w-0 items-start gap-3 p-3 text-left',
          framed !== false && 'rounded-lg border border-dashed border-border bg-surface-raised',
          className,
        )}
      >
        {iconTile}
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 flex-wrap items-center gap-1.5">
            <p className="truncate text-sm font-semibold text-text-primary">{heading}</p>
            {reasonBadge}
          </div>
          {description && <p className="mt-0.5 text-xs text-text-secondary">{description}</p>}
        </div>
        {action && <ActionButton action={action} size="xs" variant="outline" className="shrink-0" />}
      </div>
    );
  }

  const isTab = size === 'tab';
  return (
    <div
      {...common}
      className={cn(
        'flex w-full flex-col items-center justify-center text-center',
        isTab ? 'px-6 py-16' : 'h-full min-h-32 px-4 py-6',
        !isTab && framed !== false && 'rounded-xl border border-dashed border-border bg-surface-raised',
        className,
      )}
    >
      {iconTile}
      <p className="text-sm font-semibold text-text-primary">{heading}</p>
      {reasonBadge && <div className="mt-1.5">{reasonBadge}</div>}
      {description && (
        <p className={cn('mt-1 max-w-xs text-text-secondary', isTab ? 'text-sm' : 'text-xs')}>{description}</p>
      )}
      {action && (
        <div className={isTab ? 'mt-4' : 'mt-3'}>
          <ActionButton action={action} size={isTab ? 'sm' : 'xs'} variant="outline" />
        </div>
      )}
    </div>
  );
}
