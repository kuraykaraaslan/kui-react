'use client';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NODE_VISUALS, portColor, portEdgeLabel } from '../node-meta';
import type { RuleNode } from '../../../types';
import type { TraceStep } from '../runtime/traceChain';

export function ChainTracePanel({ steps, nodes }: { steps: TraceStep[] | null; nodes: RuleNode[] }) {
  if (!steps) return (
    <div className="flex min-h-48 items-center justify-center rounded-xl border border-dashed border-border">
      <p className="text-xs text-text-secondary">Click Run Chain to trace execution</p>
    </div>
  );
  if (!steps.length) return (
    <div className="flex min-h-48 items-center justify-center rounded-xl border border-dashed border-border">
      <p className="text-xs text-text-secondary">No reachable nodes — add a Trigger to start</p>
    </div>
  );
  return (
    <div>
      {steps.map((step, i) => {
        const v    = NODE_VISUALS[step.node.type];
        const next = step.edgeTaken ? nodes.find((n) => n.nodeId === step.edgeTaken!.targetNodeId) : null;
        const isLast = i === steps.length - 1;
        return (
          <div key={step.node.nodeId} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={cn('flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold',
                step.result.error ? 'bg-error-subtle text-error' : 'bg-primary-subtle text-primary')}>
                {i + 1}
              </div>
              {!isLast && <div className="my-1 w-px flex-1 bg-border" style={{ minHeight: 12 }} />}
            </div>
            <div className={cn('flex-1', isLast ? 'pb-1' : 'pb-4')}>
              <div className="mb-1 flex items-center gap-2">
                <FontAwesomeIcon icon={v.icon} className={cn('w-3 h-3 shrink-0', v.iconColor)} aria-hidden="true" />
                <span className="text-xs font-semibold text-text-primary">{step.node.label}</span>
                <span className="text-[10px] text-text-secondary">({v.displayLabel})</span>
              </div>
              {step.result.error ? (
                <p className="font-mono text-xs text-error leading-relaxed">{step.result.error}</p>
              ) : (
                <div className="flex flex-wrap items-center gap-2">
                  {step.result.portTaken && (
                    <span className="rounded-full border px-2 py-0.5 text-[10px] font-semibold"
                      style={{ color: portColor(step.result.portTaken), borderColor: portColor(step.result.portTaken) + '66' }}>
                      → {portEdgeLabel(step.result.portTaken) || step.result.portTaken}
                    </span>
                  )}
                  {next
                    ? <span className="text-[10px] text-text-secondary">→ {next.label}</span>
                    : <span className="text-[10px] italic text-text-disabled">terminal</span>}
                  <span className="tabular-nums text-[10px] text-text-disabled">{step.result.durationMs.toFixed(2)} ms</span>
                </div>
              )}
              {!step.result.error && step.result.output !== undefined && typeof step.result.output !== 'object' && (
                <div className="mt-1 font-mono text-[10px] text-text-secondary">return: {String(step.result.output)}</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
