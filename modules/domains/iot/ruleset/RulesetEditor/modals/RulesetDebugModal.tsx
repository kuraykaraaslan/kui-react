'use client';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { Modal } from '@/modules/ui/Modal';
import { traceChain, type TraceStep } from '../runtime/traceChain';
import { JsonEditor } from '../editors/JsonEditor';
import { MsgTypeInput } from '../editors/MsgTypeInput';
import { ChainTracePanel } from '../panels/ChainTracePanel';
import type { RuleNode, RuleEdge } from '../../../types';

export function RulesetDebugModal({ nodes, edges, chainName, msg, onMsgChange, metadata, onMetadataChange, messageType, onMessageTypeChange, onClose }: {
  nodes: RuleNode[]; edges: RuleEdge[]; chainName: string;
  msg: string; onMsgChange: (v: string) => void;
  metadata: string; onMetadataChange: (v: string) => void;
  messageType: string; onMessageTypeChange: (v: string) => void;
  onClose: () => void;
}) {
  const [steps, setSteps] = useState<TraceStep[] | null>(null);

  function run() {
    try {
      setSteps(traceChain(nodes, edges, JSON.parse(msg), JSON.parse(metadata), messageType));
    } catch (e) {
      setSteps([{ node: nodes[0] ?? { nodeId:'err', type:'TRIGGER', label:'Error', x:0, y:0 }, result:{ output:undefined, sideEffects:[], error:'JSON parse error: '+String(e), durationMs:0 }, edgeTaken:null }]);
    }
  }

  return (
    <Modal open onClose={onClose} title={`Debug — ${chainName}`} description="Trace message execution through the rule chain"
      className="max-w-3xl" scrollable
      footer={
        <div className="flex w-full items-center gap-2">
          <button onClick={run} disabled={!nodes.length}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-fg transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus">
            <FontAwesomeIcon icon={faPlay} className="w-3 h-3" aria-hidden="true" /> Run Chain
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
        </div>
        <ChainTracePanel steps={steps} nodes={nodes} />
      </div>
    </Modal>
  );
}
