'use client';
import { useMemo } from 'react';
import { cn } from '@/libs/utils/cn';
import { aggregateErrors, caughtRows, clock, rootNode } from './stats';
import type { DebugMessage, NodeStats, RunRecord } from './types';

export type ErrorsTabProps = {
  messages?: DebugMessage[];
  runs?: RunRecord[];
  nodeStats?: Record<string, NodeStats>;
  nodeNames?: Record<string, string>;
  onReveal?: (nodeId: string) => void;
};

const Caps = ({ children }: { children: string }) => <p className="mb-1 mt-3 text-[10px] font-semibold uppercase tracking-wide text-text-secondary first:mt-0">{children}</p>;
const Th = ({ children, num }: { children: string; num?: boolean }) => <th className={cn('py-1 font-medium', num && 'text-right')}>{children}</th>;

export function ErrorsTab({ messages, runs, nodeStats, nodeNames, onReveal }: ErrorsTabProps) {
  const rows = useMemo(() => aggregateErrors(messages), [messages]);
  const caught = useMemo(() => caughtRows(runs), [runs]);
  const counted = Object.entries(nodeStats ?? {}).filter(([, n]) => (n?.errors ?? 0) > 0);
  const name = (id: string) => nodeNames?.[rootNode(id)] ?? id;
  const Link = ({ id, title, testid, children }: { id: string; title: string; testid?: string; children?: React.ReactNode }) => (
    <button type="button" title={title} data-testid={testid} onClick={() => onReveal?.(rootNode(id))} className="text-left font-medium text-text-primary hover:underline">
      {children ?? name(id)}
    </button>
  );
  return (
    <div className="text-xs">
      <Caps>Errors while running</Caps>
      {rows.length ? (
        <table data-testid="insight-error-rows" className="w-full">
          <thead><tr className="text-left text-text-secondary"><Th>Last</Th><Th>Block</Th><Th>Error</Th><Th num>Count</Th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={`${r.node}|${r.text}`} className="border-t border-border align-top">
                <td className="py-1 pr-2 tabular-nums">{clock(r.last)}</td>
                <td className="py-1 pr-2"><Link id={r.node} title="Show this block" /></td>
                <td className="py-1 pr-2">{r.text} <span className="rounded-full bg-warning-subtle px-1.5 py-0.5 text-[10px] font-semibold text-warning-fg">not caught</span></td>
                <td className="py-1 text-right tabular-nums">{r.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : <p className="text-text-secondary">No errors in the messages read so far.</p>}

      {caught.length > 0 && (
        <>
          <Caps>Caught in recent runs</Caps>
          <table data-testid="insight-caught-rows" className="w-full">
            <thead><tr className="text-left text-text-secondary"><Th>Last</Th><Th>Block</Th><Th>Error</Th><Th>Caught by</Th><Th num>Count</Th></tr></thead>
            <tbody>
              {caught.map((r) => (
                <tr key={`${r.node}|${r.text}|${r.caught}`} className="border-t border-border align-top">
                  <td className="py-1 pr-2 tabular-nums">{clock(r.last)}</td>
                  <td className="py-1 pr-2"><Link id={r.node} title="Show this block" /></td>
                  <td className="py-1 pr-2">{r.text}</td>
                  <td className="py-1 pr-2">
                    {r.caught === r.node
                      ? <span className="rounded-full bg-success-subtle px-1.5 py-0.5 text-[10px] font-semibold text-success-fg">its error port</span>
                      : <Link id={r.caught} title="Show the block that caught it" testid="insight-caught-link">{`→ ${name(r.caught)}`}</Link>}
                  </td>
                  <td className="py-1 text-right tabular-nums">{r.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {counted.length > 0 && (
        <>
          <Caps>Error counters of the blocks</Caps>
          <ul>
            {counted.map(([id, n]) => (
              <li key={id}><Link id={id} title="Show this block" /> <span className="tabular-nums text-text-secondary">{n.errors} errors</span></li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
