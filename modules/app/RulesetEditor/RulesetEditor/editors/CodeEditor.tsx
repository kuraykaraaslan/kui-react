'use client';
import { useRef } from 'react';

export function CodeEditor({ value, onChange, readOnly = false, minHeight = 180 }: {
  value: string; onChange?: (v: string) => void; readOnly?: boolean; minHeight?: number;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumRef  = useRef<HTMLDivElement>(null);
  const lines = value.split('\n');
  function syncScroll() {
    if (lineNumRef.current && textareaRef.current)
      lineNumRef.current.scrollTop = textareaRef.current.scrollTop;
  }
  return (
    <div className="flex overflow-hidden rounded-lg border border-[#1e293b] text-xs"
      style={{ background:'#0d1117', fontFamily:'ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Courier New",monospace', lineHeight:'1.25rem', minHeight }}>
      <div ref={lineNumRef} className="overflow-hidden select-none py-3 pl-3 pr-2 text-right"
        style={{ minWidth:40, borderRight:'1px solid #1e293b', background:'#0a0e14', color:'#374151' }}>
        {lines.map((_, i) => <div key={i} style={{ lineHeight:'1.25rem' }}>{i + 1}</div>)}
      </div>
      <textarea ref={textareaRef} value={value} onChange={(e) => onChange?.(e.target.value)}
        onScroll={syncScroll} readOnly={readOnly} spellCheck={false}
        className="flex-1 resize-none bg-transparent py-3 pl-3 pr-3 outline-none"
        style={{ color:'#e2e8f0', caretColor:'#60a5fa', lineHeight:'1.25rem' }} />
    </div>
  );
}
