'use client';
// modules/ui/ColorPicker/parts/InputRow.tsx
//
// M1 — Format switcher tab row + per-format input + copy button.
//
//   ┌──────────────────────────────────────────────────────────┐
//   │  [HEX] [RGBA] [HSLA] [HWB] [OKLCH]                       │
//   │  ┌────────────────────────────────────────┐  [Copy]      │
//   │  │ #3b82f6                                │              │
//   │  └────────────────────────────────────────┘              │
//   └──────────────────────────────────────────────────────────┘
//
// The textfield validates + auto-clamps on commit (Enter or blur). Invalid
// input falls back to the formatted representation of the last good color.

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faCheck } from '@fortawesome/free-solid-svg-icons';
import type { ColorFormat, RGBA } from '../types';
import { formatRgbaAs } from '../hooks/useColorState';
import { parseColor } from '../color/parse';

const FORMATS: ColorFormat[] = ['hex', 'rgba', 'hsla', 'hwb', 'oklch'];
const FORMAT_LABELS: Record<ColorFormat, string> = {
  hex: 'HEX',
  rgba: 'RGBA',
  hsla: 'HSLA',
  hwb: 'HWB',
  oklch: 'OKLCH',
};

type InputRowProps = {
  rgba: RGBA;
  format: ColorFormat;
  onFormatChange: (f: ColorFormat) => void;
  onRgbaChange: (next: RGBA) => void;
};

export function InputRow({ rgba, format, onFormatChange, onRgbaChange }: InputRowProps) {
  const formatted = formatRgbaAs(rgba, format);
  const [draft, setDraft] = useState(formatted);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<number | null>(null);

  // Re-sync draft whenever the underlying color or format changes.
  useEffect(() => {
    setDraft(formatRgbaAs(rgba, format));
  }, [rgba, format]);

  // Cleanup the copied flag timer on unmount.
  useEffect(() => {
    return () => {
      if (copyTimer.current != null) window.clearTimeout(copyTimer.current);
    };
  }, []);

  const commit = () => {
    const parsed = parseColor(draft);
    if (parsed) {
      onRgbaChange(parsed);
    } else {
      // revert to the last good value
      setDraft(formatRgbaAs(rgba, format));
    }
  };

  const copy = async () => {
    const text = formatRgbaAs(rgba, format);
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      }
      setCopied(true);
      if (copyTimer.current != null) window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // Clipboard API blocked — silent fail; the value is still in the input.
    }
  };

  return (
    <div className="space-y-2">
      <div
        role="tablist"
        aria-label="Color format"
        className="flex items-center gap-0.5 rounded-md border border-border bg-surface-base p-0.5"
      >
        {FORMATS.map((f) => {
          const active = f === format;
          return (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onFormatChange(f)}
              className={cn(
                'flex-1 px-1.5 py-1 rounded text-[10px] font-medium uppercase tracking-wide',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
                'transition-colors',
                active
                  ? 'bg-primary text-primary-fg'
                  : 'text-text-secondary hover:bg-surface-overlay'
              )}
            >
              {FORMAT_LABELS[f]}
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="text"
          spellCheck={false}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              commit();
            }
          }}
          onBlur={commit}
          aria-label={`${FORMAT_LABELS[format]} value`}
          className="flex-1 min-w-0 font-mono text-xs px-2 py-1 rounded border border-border bg-surface-base text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
        />
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? 'Copied' : 'Copy value'}
          title={copied ? 'Copied' : 'Copy'}
          className="w-7 h-7 inline-flex items-center justify-center rounded border border-border bg-surface-base text-text-secondary hover:bg-surface-overlay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus transition-colors"
        >
          <FontAwesomeIcon
            icon={copied ? faCheck : faCopy}
            className="w-3 h-3"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  );
}
