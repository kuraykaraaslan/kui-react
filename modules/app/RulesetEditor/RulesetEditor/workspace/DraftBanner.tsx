'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faTriangleExclamation, faXmark } from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/libs/utils/cn';
import type { Draft } from '../../graph/draft';
import { PrimaryButton, SecondaryButton } from '../dialogs/buttons';
import { useMessages } from '../messages';

/** "14:05, 6 Oct" */
export function draftTime(ts: number, locale = 'en-GB'): string {
  return new Date(ts * 1000).toLocaleString(locale, { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' });
}

/** Unsaved work was found in this browser: restore it or throw it away. */
export function DraftBanner({ draft, stale, onRestore, onDiscard }: { draft: Draft; stale: boolean; onRestore: () => void; onDiscard: () => void }) {
  const m = useMessages();
  return (
    <div role="status" data-testid="flow-draft"
      className="flex shrink-0 flex-wrap items-center gap-2 border-b border-border bg-warning-subtle px-4 py-2 text-sm text-text-primary">
      <FontAwesomeIcon icon={faTriangleExclamation} className="h-3.5 w-3.5 shrink-0 text-warning" aria-hidden="true" />
      <span className="min-w-0 flex-1">
        {m.wsDraftFound(draftTime(draft.ts, m.wsLocale))}
        {stale && ` ${m.wsDraftStale}`}
      </span>
      <PrimaryButton onClick={onRestore} data-testid="flow-draft-restore">{m.wsRestore}</PrimaryButton>
      <SecondaryButton onClick={onDiscard} data-testid="flow-draft-discard">{m.wsDiscard}</SecondaryButton>
    </div>
  );
}

export type Notice = { text: string; tone: 'info' | 'warning' | 'error' };

/** A short message of the workspace (a jump found nothing, the draft cannot be kept). */
export function NoticeBanner({ notice, onClose }: { notice: Notice; onClose: () => void }) {
  const m = useMessages();
  return (
    <div role={notice.tone === 'info' ? 'status' : 'alert'} data-testid="flow-notice"
      className={cn(
        'flex shrink-0 items-center gap-2 border-b border-border px-4 py-1.5 text-xs text-text-primary',
        notice.tone === 'error' ? 'bg-error-subtle' : notice.tone === 'warning' ? 'bg-warning-subtle' : 'bg-surface-raised',
      )}>
      <FontAwesomeIcon icon={notice.tone === 'info' ? faCircleInfo : faTriangleExclamation}
        className={cn('h-3 w-3 shrink-0', notice.tone === 'error' ? 'text-error' : notice.tone === 'warning' ? 'text-warning' : 'text-text-secondary')} aria-hidden="true" />
      <span className="min-w-0 flex-1">{notice.text}</span>
      <button type="button" onClick={onClose} aria-label={m.wsDismiss}
        className="rounded p-1 text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus">
        <FontAwesomeIcon icon={faXmark} className="h-3 w-3" aria-hidden="true" />
      </button>
    </div>
  );
}
