'use client';
import type { RuleNode } from '../../../types';
import { NODE_VISUALS } from '../node-meta';
import { DEFAULT_SCRIPTS } from '../default-scripts';

export type RunResult = {
  output: unknown; portTaken?: string;
  sideEffects: string[]; error?: string; durationMs: number;
};

export function runScript(node: RuleNode, msg: unknown, metadata: unknown, messageType: string): RunResult {
  const script = node.script ?? DEFAULT_SCRIPTS[node.type];
  const v = NODE_VISUALS[node.type];
  const sideEffects: string[] = [];
  const t0 = performance.now();
  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function('msg','metadata','message_type','send','getDeviceLabel','getDeviceTags', script);
    const output = fn(
      JSON.parse(JSON.stringify(msg ?? {})),
      JSON.parse(JSON.stringify(metadata ?? {})),
      messageType,
      (p: unknown) => sideEffects.push(JSON.stringify(p, null, 2)),
      (id: string) => `Label-${id}`,
      () => ['sensor','iot'],
    );
    const durationMs = performance.now() - t0;
    let portTaken: string | undefined;
    if (v.outputs.length === 1) portTaken = v.outputs[0].id;
    else if (v.outputs.length > 1) {
      portTaken = node.type === 'FILTER'
        ? (output ? 'true' : 'false')
        : (v.outputs.find((p) => p.id === String(output))?.id ?? v.outputs.at(-1)?.id);
    }
    return { output, portTaken, sideEffects, durationMs };
  } catch (e) {
    return { output: undefined, sideEffects, error: String(e), durationMs: performance.now() - t0 };
  }
}
