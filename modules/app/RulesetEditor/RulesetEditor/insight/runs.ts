/**
 * The run history of a flow as the Runs panel needs it (09 §9.5): the records a host keeps of recent runs, a per-node and
 * per-status view, and the frames of the trace player. Pure: no React, no engine. The host supplies the records.
 */
export type RunStatus = 'ok' | 'error' | 'left_open' | 'dropped';

export type RunStep = {
  i: number;
  /** milliseconds since the epoch */
  t: number;
  node: string;
  type: string;
  in: unknown;
  ms: number;
  error?: { code: string; message: string };
  out: { port: string; msg: unknown; to: string[] }[];
};

export type RunRow = {
  run: string;
  /** milliseconds since the epoch */
  ts: number;
  ms: number;
  status: RunStatus;
  level: 'all' | 'failures' | 'trace';
  originator: { type: string; id: string };
  msgType: string;
  trigger: { node: string; input: unknown };
  /** node ids in visit order */
  path: string[];
  /** every step under `all` and a trace; only the failing nodes' inputs under `failures`; absent when none were kept */
  steps?: RunStep[];
  outputs: { node: string; port: string; msg: unknown }[];
  errors: { node: string; code: string; message: string; caught: boolean }[];
  actions: { node: string; type: string; result: string; text: string }[];
};

export type StatusFilter = 'all' | 'error' | 'left_open' | 'dropped';

/** Newest first, narrowed by status and, for the per-node view ("the last runs of this node"), by a node the run visited. */
export function filterRuns(runs: readonly RunRow[], status: StatusFilter, nodeId?: string | null): RunRow[] {
  return runs
    .filter((r) => (status === 'all' || r.status === status) && (!nodeId || r.path.includes(nodeId) || r.trigger.node === nodeId))
    .sort((a, b) => b.ts - a.ts);
}

/** One frame of the player: frame 0 is the message that started the run, frame n the n-th step. */
export type Frame =
  | { kind: 'trigger'; node: string; in: unknown }
  | { kind: 'step'; step: RunStep }
  | { kind: 'path'; node: string };

/** The frames of a run: its steps when it kept them, else the bare path (the nodes it visited, with no message). */
export function framesOf(run: RunRow): Frame[] {
  const head: Frame = { kind: 'trigger', node: run.trigger.node, in: run.trigger.input };
  if (run.steps?.length) return [head, ...[...run.steps].sort((a, b) => a.i - b.i).map((step): Frame => ({ kind: 'step', step }))];
  return [head, ...run.path.map((node): Frame => ({ kind: 'path', node }))];
}

/** What the canvas should mark while the player is on frame `index`: the nodes already visited, the current one, a failed one. */
export function markOf(frames: readonly Frame[], index: number): { visited: string[]; current: string | null; failed: string | null } {
  const upto = frames.slice(0, Math.max(0, index) + 1);
  const nodeOf = (f: Frame) => (f.kind === 'step' ? f.step.node : f.node);
  const visited = [...new Set(upto.map(nodeOf))];
  const cur = frames[index];
  const current = cur ? nodeOf(cur) : null;
  return { visited, current, failed: cur?.kind === 'step' && cur.step.error ? cur.step.node : null };
}

/** Is this run listed as a problem (error, left open or dropped)? */
export const isProblemRun = (r: Pick<RunRow, 'status'>): boolean => r.status !== 'ok';

/** "kept X of Y runs": the honest line over the debug counters, empty when the host gave none. */
export function keptLine(c: { kept: number; recorded: number; dropped: number; evicted: number } | undefined): string | null {
  return c ? `${c.kept}/${c.recorded}` : null;
}
