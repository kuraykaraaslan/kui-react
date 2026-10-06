'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { InsightPanel } from '@/modules/domains/iot/ruleset/RulesetEditor/insight/InsightPanel';
import type { DebugMessage, NodeStats, RunRecord } from '@/modules/domains/iot/ruleset/RulesetEditor/insight/types';
import { DocumentTitle } from '@/libs/utils/DocumentTitle';

const NAMES: Record<string, string> = { n1: 'Sensor in', n2: 'Too hot?', n3: 'Tell the operator', s1: 'Hold 2 min', c1: 'Catch all' };
const RUNS: RunRecord[] = [
  { ts: Math.floor(Date.now() / 1000) - 60, errors: [{ node: 'n3', message: 'SMS gateway timed out', caught: 'c1' }, { node: 'n2', message: 'bad number', caught: 'n2' }] },
];

/** Simulated host: a message every second and counters that grow, so every tab has something to show. */
export default function InsightDemoPage() {
  const [messages, setMessages] = useState<DebugMessage[]>([]);
  const [stats, setStats] = useState<Record<string, NodeStats>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [notice, setNotice] = useState('');
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
    </main>
  );
}
