'use client';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrash, faXmark, faRotateLeft, faCheck, faBug,
} from '@fortawesome/free-solid-svg-icons';
import { NODE_VISUALS, nodePorts, portColor } from '../node-meta';
import { CodeEditor } from '../editors/CodeEditor';
import type { RuleNode } from '../../../types';

const SOURCE_NAME = { kui: 'another ruleset file', 'node-red': 'a Node-RED flow' } as const;

/** Why a placeholder exists, and what it was (read-only). */
function PlaceholderDetails({ node }: { node: RuleNode }) {
  const o = node.original;
  const settings = o?.settings === undefined ? '{}' : JSON.stringify(o.settings, null, 2);
  return (
    <div className="space-y-4">
      <div role="note" className="rounded-lg border border-dashed border-warning bg-warning-subtle px-3 py-2.5 text-xs leading-relaxed text-text-primary">
        <p className="font-semibold">Not available here</p>
        <p className="mt-1">
          This node came from {SOURCE_NAME[o?.source ?? 'kui']} and its type
          {' '}<span className="font-mono font-semibold">{o?.type ?? 'unknown'}</span>{' '}
          does not exist on this system. It keeps its connections so the flow stays readable,
          but it does nothing: messages that reach it stop here. Replace it with an available node, or delete it.
        </p>
      </div>
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
        <dt className="font-semibold text-text-secondary">Original type</dt>
        <dd className="break-all font-mono text-text-primary">{o?.type ?? 'unknown'}</dd>
        <dt className="font-semibold text-text-secondary">Source</dt>
        <dd className="text-text-primary">{o?.source === 'node-red' ? 'Node-RED' : 'kui ruleset'}</dd>
      </dl>
      <div>
        <p id={`ph-settings-${node.nodeId}`} className="mb-1.5 text-xs font-semibold text-text-secondary">Original settings (read-only)</p>
        <pre tabIndex={0} aria-labelledby={`ph-settings-${node.nodeId}`}
          className="max-h-64 overflow-auto rounded-lg border border-border bg-surface-base px-3 py-2 font-mono text-[11px] leading-relaxed text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus">
          {settings}
        </pre>
      </div>
    </div>
  );
}

export function NodeEditorPanel({ node, readOnly, draftLabel, draftScript, onLabelChange, onScriptChange, onApply, onClose, onDelete, onReset, onDebug }: {
  node: RuleNode; readOnly: boolean;
  draftLabel: string; draftScript: string;
  onLabelChange: (v: string) => void; onScriptChange: (v: string) => void;
  onApply: () => void; onClose: () => void; onDelete: () => void; onReset: () => void;
  onDebug: () => void;
}) {
  const visual = NODE_VISUALS[node.type];
  const ports = nodePorts(node);
  const placeholder = node.type === 'PLACEHOLDER';
  return (
    <aside className="flex w-80 shrink-0 flex-col overflow-hidden border-l border-border bg-surface-raised max-md:absolute max-md:inset-0 max-md:z-50 max-md:w-auto max-md:border-l-0">
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
        <div className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-lg', visual.headerBg)}>
          <FontAwesomeIcon icon={visual.icon} className={cn('w-3.5 h-3.5', visual.iconColor)} aria-hidden="true" />
        </div>
        <p className="flex-1 min-w-0 text-[11px] font-bold uppercase tracking-widest text-text-secondary">{visual.displayLabel}</p>
        <button onClick={onDebug} title="Debug node" aria-label="Debug node"
          className="shrink-0 rounded p-1 text-text-secondary transition-colors hover:bg-primary-subtle hover:text-primary">
          <FontAwesomeIcon icon={faBug} className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
        {!readOnly && (
          <button onClick={onDelete} title="Delete node" aria-label="Delete node"
            className="shrink-0 rounded p-1 text-text-secondary transition-colors hover:bg-error-subtle hover:text-error">
            <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        )}
        <button onClick={onClose} aria-label="Close panel"
          className="shrink-0 rounded p-1 text-text-secondary transition-colors hover:text-text-primary">
          <FontAwesomeIcon icon={faXmark} className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>
      {/* Body */}
      <div className="flex-1 space-y-5 overflow-y-auto p-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-text-secondary">Label</label>
          <input value={draftLabel} onChange={(e) => onLabelChange(e.target.value)} readOnly={readOnly}
            className={cn('w-full rounded-lg border border-border bg-surface-base px-3 py-1.5 text-sm text-text-primary outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/20', readOnly && 'cursor-default opacity-60')} />
        </div>
        {!placeholder && <p className="text-xs -mt-2 leading-relaxed text-text-secondary">{visual.description}</p>}
        {placeholder && <PlaceholderDetails node={node} />}
        {!placeholder && <div>
          <p className="mb-2 text-xs font-semibold text-text-secondary">Available inputs</p>
          <div className="flex flex-wrap gap-1.5">
            {(['msg','metadata','message_type'] as const).map((v) => (
              <span key={v} className="rounded-md border border-primary/25 bg-primary-subtle px-2 py-0.5 font-mono text-xs font-semibold text-primary">{v}</span>
            ))}
          </div>
        </div>}
        {(ports.inputs.length > 0 || ports.outputs.length > 0) && (
          <div className="flex gap-6">
            {ports.inputs.length > 0 && (
              <div>
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-text-secondary">In</p>
                {ports.inputs.map((p) => (
                  <div key={p.id} className="mb-1 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full border-2 border-border-strong bg-surface-base" />
                    <span className="font-mono text-[11px] text-text-secondary">{p.id}</span>
                  </div>
                ))}
              </div>
            )}
            {ports.outputs.length > 0 && (
              <div>
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-text-secondary">Out</p>
                {ports.outputs.map((p) => (
                  <div key={p.id} className="mb-1 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ background: portColor(p.id) }} />
                    <span className="font-mono text-[11px]" style={{ color: portColor(p.id) }}>{p.id}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {!placeholder && <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold text-text-secondary">JavaScript</p>
            {!readOnly && (
              <button onClick={onReset} className="flex items-center gap-1 text-xs text-text-secondary transition-colors hover:text-primary">
                <FontAwesomeIcon icon={faRotateLeft} className="w-3 h-3" aria-hidden="true" /> Reset
              </button>
            )}
          </div>
          <CodeEditor value={draftScript} onChange={onScriptChange} readOnly={readOnly} />
        </div>}
      </div>
      {/* Footer */}
      {!readOnly && (
        <div className="flex items-center justify-between gap-2 border-t border-border px-4 py-3">
          <button onClick={onApply}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-fg transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus">
            <FontAwesomeIcon icon={faCheck} className="w-3 h-3" aria-hidden="true" /> Apply
          </button>
          <button onClick={onClose}
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-text-secondary transition-colors hover:border-border-strong hover:text-text-primary">
            Close
          </button>
        </div>
      )}
    </aside>
  );
}
