'use client';

export function MsgTypeInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <span className="mb-1 block font-mono text-xs font-semibold text-primary">message_type</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} spellCheck={false}
        placeholder="POST_TELEMETRY_REQUEST"
        className="w-full rounded-lg border border-border bg-surface-base px-3 py-1.5 font-mono text-xs text-text-primary outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/20" />
    </div>
  );
}
