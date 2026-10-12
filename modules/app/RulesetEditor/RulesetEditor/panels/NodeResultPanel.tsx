'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { portColor, portEdgeLabel } from '../node-meta';
import type { RunResult } from '../runtime/runScript';

export function NodeResultPanel({ result }: { result: RunResult | null }) {
  if (!result) return (
    <div className="flex min-h-48 items-center justify-center rounded-xl border border-dashed border-border">
      <p className="text-xs text-text-secondary">Click Run to execute the script</p>
    </div>
  );
  if (result.error) return (
    <div className="space-y-2 rounded-xl border border-error/30 bg-error-subtle p-4">
      <div className="flex items-center gap-2">
        <FontAwesomeIcon icon={faCircleXmark} className="w-4 h-4 shrink-0 text-error" aria-hidden="true" />
        <span className="text-sm font-semibold text-error">Script Error</span>
      </div>
      <pre className="whitespace-pre-wrap break-all font-mono text-xs leading-relaxed" style={{ color:'var(--error)' }}>{result.error}</pre>
    </div>
  );
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between rounded-lg border border-success/30 bg-success-subtle px-3 py-2">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faCircleCheck} className="w-4 h-4 shrink-0 text-success" aria-hidden="true" />
          <span className="text-xs font-semibold" style={{ color:'var(--success-fg)' }}>Executed successfully</span>
        </div>
        <span className="tabular-nums text-[10px] text-text-secondary">{result.durationMs.toFixed(2)} ms</span>
      </div>
      {result.portTaken && (
        <div>
          <p className="mb-1.5 text-xs font-semibold text-text-secondary">Output port</p>
          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"
            style={{ color: portColor(result.portTaken), borderColor: portColor(result.portTaken) + '66' }}>
            → {portEdgeLabel(result.portTaken) || result.portTaken}
          </span>
        </div>
      )}
      {result.output !== undefined && (
        <div>
          <p className="mb-1.5 text-xs font-semibold text-text-secondary">Return value</p>
          <pre className="overflow-x-auto rounded-lg border border-border bg-surface-base p-3 font-mono text-xs text-text-primary">
            {JSON.stringify(result.output, null, 2)}
          </pre>
        </div>
      )}
      {result.sideEffects.length > 0 && (
        <div>
          <p className="mb-1.5 text-xs font-semibold text-text-secondary">Side effects — send()</p>
          <div className="space-y-2">
            {result.sideEffects.map((ef, i) => (
              <pre key={i} className="overflow-x-auto rounded-lg border border-border bg-surface-base p-3 font-mono text-xs text-text-primary">{ef}</pre>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
