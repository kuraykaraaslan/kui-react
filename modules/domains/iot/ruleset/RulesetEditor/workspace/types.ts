import type { RulesetGraph } from '../hooks/useGraphEditor';

export type FlowKind = 'flow' | 'subflow';

/** a tab of the strip: a flow or a subflow of the host */
export type WorkspaceTab = {
  id: string;
  kind: FlowKind;
  name: string;
  /** a switched-off flow is drawn dimmed and in italics */
  enabled?: boolean;
  /** shows the "Rule" badge; pass it only for flows another editor (a rule form) can open */
  isRule?: boolean;
};

/** the flow open in the editor; `id: null` is a flow that is not saved yet */
export type ActiveFlow = {
  id: string | null;
  kind: FlowKind;
  name: string;
  graph: RulesetGraph;
  isRule?: boolean;
};

/** a flow as the host has it */
export type LoadedFlow = { name?: string; graph: RulesetGraph };

/** a conflict the host found when it saved: someone saved this flow in the meantime */
export type ConflictInfo = {
  /** seconds since the epoch, when the other version was saved */
  at?: number;
  by?: string;
};

export type TabRef = { kind: FlowKind; id: string };
