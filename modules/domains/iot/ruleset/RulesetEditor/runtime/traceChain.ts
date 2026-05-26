'use client';
import type { RuleNode, RuleEdge } from '../../../types';
import { runScript, type RunResult } from './runScript';

export type TraceStep = { node: RuleNode; result: RunResult; edgeTaken: RuleEdge | null };

export function traceChain(nodes: RuleNode[], edges: RuleEdge[], msg: unknown, metadata: unknown, messageType: string): TraceStep[] {
  if (!nodes.length) return [];
  const inIds = new Set(edges.map((e) => e.targetNodeId));
  let cur: RuleNode | undefined = nodes.find((n) => !inIds.has(n.nodeId)) ?? nodes[0];
  let curMsg: unknown = JSON.parse(JSON.stringify(msg ?? {}));
  const visited = new Set<string>();
  const steps: TraceStep[] = [];
  while (cur && !visited.has(cur.nodeId)) {
    visited.add(cur.nodeId);
    const result = runScript(cur, curMsg, metadata, messageType);
    if (!result.error && result.output !== undefined && ['TRANSFORM','ENRICHMENT'].includes(cur.type)) curMsg = result.output;
    const edgeTaken = result.portTaken && !result.error
      ? (edges.find((e) => e.sourceNodeId === cur!.nodeId && e.sourcePort === result.portTaken) ?? null)
      : null;
    steps.push({ node: cur, result, edgeTaken });
    if (result.error || !edgeTaken) break;
    cur = nodes.find((n) => n.nodeId === edgeTaken.targetNodeId);
  }
  return steps;
}
