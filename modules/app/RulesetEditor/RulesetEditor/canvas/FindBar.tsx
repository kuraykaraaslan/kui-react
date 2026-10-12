'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef } from 'react';
import { useMessages } from '../messages';

const iconBtn = 'rounded p-1.5 text-text-secondary transition-colors hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus disabled:opacity-40';

/** The find box over the canvas (Ctrl+F): type to mark the blocks that match, Enter and Shift+Enter step, Esc closes. */
export function FindBar({ query, count, current, focusTick, onQuery, onStep, onClose }: {
  query: string;
  /** how many blocks match */
  count: number;
  /** the one stepped to, counting from 0 */
  current: number;
  /** changes each time Ctrl+F is pressed again: the field takes the focus and selects its text */
  focusTick: number;
  onQuery: (query: string) => void;
  onStep: (delta: 1 | -1) => void;
  onClose: () => void;
}) {
  const m = useMessages();
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { ref.current?.focus(); ref.current?.select(); }, [focusTick]);
  return (
    <div role="search" data-testid="find-bar" onPointerDown={(e) => e.stopPropagation()}
      className="absolute left-1/2 top-3 z-30 flex -translate-x-1/2 items-center gap-1 rounded-lg border border-border bg-surface-base px-2 py-1 shadow-lg">
      <input
        ref={ref} type="search" value={query} aria-label={m.findLabel} placeholder={m.findPlaceholder} data-testid="find-input"
        onChange={(e) => onQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') { e.preventDefault(); onStep(e.shiftKey ? -1 : 1); }
          else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); onClose(); }
        }}
        className="w-56 rounded-md border border-border bg-surface-base px-2 py-1 text-xs text-text-primary outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
      <span aria-live="polite" data-testid="find-count" className="min-w-14 text-center text-xs tabular-nums text-text-secondary">
        {query.trim() ? (count ? m.findCount(current + 1, count) : m.findNone) : ''}
      </span>
      <button type="button" aria-label={m.findPrev} title={m.findPrev} disabled={!count} onClick={() => onStep(-1)} className={iconBtn}>
        <FontAwesomeIcon icon={faChevronUp} className="h-3 w-3" aria-hidden="true" />
      </button>
      <button type="button" aria-label={m.findNext} title={m.findNext} disabled={!count} onClick={() => onStep(1)} className={iconBtn}>
        <FontAwesomeIcon icon={faChevronDown} className="h-3 w-3" aria-hidden="true" />
      </button>
      <button type="button" aria-label={m.findClose} title={m.findClose} onClick={onClose} className={iconBtn}>
        <FontAwesomeIcon icon={faXmark} className="h-3 w-3" aria-hidden="true" />
      </button>
    </div>
  );
}
