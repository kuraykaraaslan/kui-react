'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { InsightPanel } from '@/modules/app/RulesetEditor/RulesetEditor/insight/InsightPanel';
import { RunsPanel } from '@/modules/app/RulesetEditor/RulesetEditor/insight/RunsPanel';
import type { RunRow } from '@/modules/app/RulesetEditor/RulesetEditor/insight/runs';
import type { DebugMessage, NodeStats, RunRecord } from '@/modules/app/RulesetEditor/RulesetEditor/insight/types';
import { DocumentTitle } from '@/libs/utils/DocumentTitle';

const NAMES: Record<string, string> = { n1: 'Sensor in', n2: 'Too hot?', n3: 'Tell the operator', s1: 'Hold 2 min', c1: 'Catch all' };
const RUNS: RunRecord[] = [
  { ts: Math.floor(Date.now() / 1000) - 60, errors: [{ node: 'n3', message: 'SMS gateway timed out', caught: 'c1' }, { node: 'n2', message: 'bad number', caught: 'n2' }] },
];

const NOW = Date.now();
const msg = (n: number) => ({ payload: { temp: 20 + n }, topic: 'boiler/temp' });
/** Recorded runs for the Runs panel: a good one, a failed one with its steps, and one kept without steps. */
const RUN_ROWS: RunRow[] = [
  {
    run: 'r3', ts: NOW - 20_000, ms: 12, status: 'error', level: 'all', originator: { type: 'device', id: 'boiler-1' }, msgType: 'POST_TELEMETRY',
    trigger: { node: 'n1', input: msg(18) }, path: ['n2', 'n3'],
    steps: [
      { i: 1, t: NOW - 19_990, node: 'n2', type: 'cond.expr', in: msg(18), ms: 1, out: [{ port: 'yes', msg: msg(18), to: ['n3'] }] },
      { i: 2, t: NOW - 19_980, node: 'n3', type: 'action.notify', in: msg(18), ms: 9, error: { code: 'timeout', message: 'SMS gateway timed out' }, out: [] },
    ],
    outputs: [], errors: [{ node: 'n3', code: 'timeout', message: 'SMS gateway timed out', caught: false }], actions: [],
  },
  {
    run: 'r2', ts: NOW - 50_000, ms: 3, status: 'ok', level: 'all', originator: { type: 'device', id: 'boiler-1' }, msgType: 'POST_TELEMETRY',
    trigger: { node: 'n1', input: msg(3) }, path: ['n2'],
    steps: [{ i: 1, t: NOW - 49_990, node: 'n2', type: 'cond.expr', in: msg(3), ms: 1, out: [{ port: 'no', msg: msg(3), to: [] }] }],
    outputs: [{ node: 'n2', port: 'no', msg: msg(3) }], errors: [], actions: [],
  },
  {
    run: 'r1', ts: NOW - 90_000, ms: 40, status: 'left_open', level: 'failures', originator: { type: 'device', id: 'boiler-2' }, msgType: 'POST_TELEMETRY',
    trigger: { node: 'n1', input: msg(25) }, path: ['n2', 's1'], outputs: [], errors: [], actions: [],
  },
];

/** Simulated host: a message every second and counters that grow, so every tab has something to show. */
export default function InsightDemoPage() {
  const [messages, setMessages] = useState<DebugMessage[]>([]);
  const [stats, setStats] = useState<Record<string, NodeStats>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [notice, setNotice] = useState('');
  const [mark, setMark] = useState<string>('');
  const seq = useRef(0);

  useEffect(() => {
    const t = window.setInterval(() => {
      const n = ++seq.current;
      const kind = n % 7 === 0 ? 'error' : n % 5 === 0 ? 'warn' : 'msg';
      const node = ['n1', 'n2', 's1/x'][n % 3];
      setMessages((m) => m.concat({
        seq: n, ts: Math.floor(Date.now() / 1000), flow: 'demo', node, kind,
        text: kind === 'msg' ? undefined : kind === 'error' ? 'value is not a number' : 'queue is filling up',
        msg: { temp: 20 + (n % 15), n }, topic: 'boiler/temp',
      }).slice(-1000));
      setStats((s) => {
        const bump = (id: string, ms: number, err = 0): NodeStats => ({ in: (s[id]?.in ?? 0) + 1, out: (s[id]?.in ?? 0) + 1, errors: (s[id]?.errors ?? 0) + err, avgMs: ms });
        return { ...s, [node]: bump(node, 1 + (n % 9), kind === 'error' ? 1 : 0), n3: bump('n3', 12) };
      });
    }, 1000);
    return () => window.clearInterval(t);
  }, []);

  return (
    <main className="mx-auto max-w-5xl p-4">
      <DocumentTitle text="Runtime insight demo" />
      <Link href="/theme/iot/rulesets" className="mb-3 inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary">
        <FontAwesomeIcon icon={faArrowLeft} className="h-3 w-3" aria-hidden="true" /> Rulesets
      </Link>
      <h1 className="text-xl font-semibold text-text-primary">Runtime insight</h1>
      <p className="mb-3 text-sm text-text-secondary">Simulated numbers from a host: debug messages, counters, caught errors and a context store at 85%. Click a block name to “reveal” it.</p>
      {selected && <p className="mb-2 text-xs text-text-secondary" data-testid="insight-demo-selected">Revealed: {NAMES[selected] ?? selected}</p>}
      {notice && <p className="mb-2 text-xs text-text-secondary" role="status">{notice}</p>}
      <div className="h-[560px] max-w-md">
        <InsightPanel
          chainId="boiler-demo" messages={messages} nodeStats={stats} nodeNames={NAMES} runs={RUNS} selectedNodeId={selected}
          context={{ memory: { bytes: 870_000, limit: 1_024_000 }, persist: { bytes: 1_048_576, limit: 1_048_576 } }}
          onReveal={setSelected}
          onNotice={(k, c) => setNotice(k === 'empty' ? 'No messages to save.' : k === 'saved' ? `Saved ${c} messages.` : `${c} messages copied.`)}
        />
      </div>
      <h2 className="mb-1 mt-6 text-lg font-semibold text-text-primary">Runs</h2>
      <p className="mb-3 text-sm text-text-secondary">Recorded runs: open one and step through it. The host marks its canvas with what the player has passed.</p>
      {mark && <p className="mb-2 text-xs text-text-secondary" data-testid="runs-demo-mark">Canvas: {mark}</p>}
      <div className="h-[560px] max-w-md border border-border">
        <RunsPanel
          runs={RUN_ROWS} nodeNames={NAMES} selectedNodeId={selected} onReveal={setSelected}
          onMark={(m) => setMark(m ? `passed ${m.visited.map((id) => NAMES[id] ?? id).join(' → ')}${m.failed ? ` (failed at ${NAMES[m.failed] ?? m.failed})` : ''}` : '')}
          onTestInput={(r, step, node) => setNotice(`Would test ${NAMES[node] ?? node} with the input of step ${step} of run ${r.run}.`)}
        />
      </div>
    </main>
  );
}
