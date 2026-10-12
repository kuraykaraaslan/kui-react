'use client';
import { cn } from '@/libs/utils/cn';

export function JsonEditor({ label, value, onChange, rows = 4 }: {
  label: string; value: string; onChange: (v: string) => void; rows?: number;
}) {
  const valid = (() => { try { JSON.parse(value); return true; } catch { return false; } })();
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="font-mono text-xs font-semibold text-primary">{label}</span>
        {!valid && <span className="text-[10px] font-medium text-error">Invalid JSON</span>}
      </div>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} spellCheck={false}
        className={cn(
          'w-full resize-none rounded-lg border bg-surface-base px-3 py-2 font-mono text-xs text-text-primary outline-none transition-colors',
          valid ? 'border-border focus:border-primary focus:ring-1 focus:ring-primary/20' : 'border-error/50 focus:border-error',
        )} />
    </div>
  );
}
