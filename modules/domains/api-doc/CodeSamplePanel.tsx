'use client';
import { cn } from '@/libs/utils/cn';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCopy } from '@fortawesome/free-solid-svg-icons';

type CodeSample = {
  lang: string;
  label?: string | null;
  source: string;
};

type Props = {
  samples: CodeSample[];
  className?: string;
};

export function CodeSamplePanel({ samples, className }: Props) {
  const [activeLang, setActiveLang] = useState(samples[0]?.lang ?? '');
  const [copied, setCopied] = useState(false);

  const active = samples.find((s) => s.lang === activeLang) ?? samples[0];

  async function copy() {
    if (!active) return;
    await navigator.clipboard.writeText(active.source);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const options = samples.map((s) => ({
    label: s.label ?? s.lang,
    value: s.lang,
  }));

  if (!samples.length) return null;

  return (
    <div className={cn('rounded-lg border border-border overflow-hidden bg-gray-950', className)}>
      <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-white/10">
        <div className="flex gap-1 flex-wrap">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setActiveLang(opt.value)}
              className={cn(
                'rounded px-2.5 py-1 text-xs font-medium transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
                activeLang === opt.value
                  ? 'bg-white/15 text-white'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/10',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? 'Copied' : 'Copy code'}
          className={cn(
            'flex items-center gap-1.5 rounded px-2 py-1 text-xs transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
            copied ? 'text-success' : 'text-white/50 hover:text-white/80',
          )}
        >
          <FontAwesomeIcon icon={copied ? faCheck : faCopy} className="w-3 h-3" aria-hidden="true" />
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <pre className="overflow-x-auto p-4 text-xs text-white/90 font-mono leading-relaxed">
        <code>{active?.source}</code>
      </pre>
    </div>
  );
}
