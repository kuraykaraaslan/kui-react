'use client';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { Modal } from '@/modules/ui/Modal';
import { NODE_VISUALS } from '../node-meta';
import { DEFAULT_SCRIPTS } from '../default-scripts';
import { runScript, type RunResult } from '../runtime/runScript';
import { CodeEditor } from '../editors/CodeEditor';
import { JsonEditor } from '../editors/JsonEditor';
import { MsgTypeInput } from '../editors/MsgTypeInput';
import { NodeResultPanel } from '../panels/NodeResultPanel';
import type { RuleNode } from '../../../types';

export function NodeDebugModal({ node, msg, onMsgChange, metadata, onMetadataChange, messageType, onMessageTypeChange, onClose }: {
  node: RuleNode;
  msg: string; onMsgChange: (v: string) => void;
  metadata: string; onMetadataChange: (v: string) => void;
  messageType: string; onMessageTypeChange: (v: string) => void;
  onClose: () => void;
}) {
  const [result, setResult] = useState<RunResult | null>(null);
  const visual = NODE_VISUALS[node.type];

  function run() {
    try {
      setResult(runScript(node, JSON.parse(msg), JSON.parse(metadata), messageType));
    } catch (e) {
      setResult({ output: undefined, sideEffects: [], error: 'JSON parse error: ' + String(e), durationMs: 0 });
    }
  }

  return (
    <Modal open onClose={onClose} title={`Debug — ${node.label}`} description={visual.description}
      className="max-w-2xl" scrollable
      footer={
        <div className="flex w-full items-center gap-2">
          <button onClick={run}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-fg transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus">
            <FontAwesomeIcon icon={faPlay} className="w-3 h-3" aria-hidden="true" /> Run
          </button>
          <button onClick={onClose}
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-text-secondary transition-colors hover:border-border-strong hover:text-text-primary">
            Close
          </button>
        </div>
      }>
      <div className="grid grid-cols-[220px_1fr] gap-5">
        <div className="space-y-3">
          <JsonEditor label="msg" value={msg} onChange={onMsgChange} />
          <JsonEditor label="metadata" value={metadata} onChange={onMetadataChange} />
          <MsgTypeInput value={messageType} onChange={onMessageTypeChange} />
          <div>
            <p className="mb-1.5 text-xs font-semibold text-text-secondary">Script</p>
            <CodeEditor value={node.script ?? DEFAULT_SCRIPTS[node.type]} readOnly minHeight={120} />
          </div>
        </div>
        <NodeResultPanel result={result} />
      </div>
    </Modal>
  );
}
