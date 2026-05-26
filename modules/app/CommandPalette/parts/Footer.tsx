'use client';

export function Footer() {
  return (
    <div className="flex items-center gap-4 border-t border-border pt-3 text-[10px] text-text-disabled">
      <span>
        <kbd className="rounded border border-border px-1 py-0.5 font-mono text-[9px]">↑↓</kbd>{' '}
        Navigate
      </span>
      <span>
        <kbd className="rounded border border-border px-1 py-0.5 font-mono text-[9px]">↵</kbd>{' '}
        Select
      </span>
      <span>
        <kbd className="rounded border border-border px-1 py-0.5 font-mono text-[9px]">Esc</kbd>{' '}
        Close
      </span>
    </div>
  );
}
