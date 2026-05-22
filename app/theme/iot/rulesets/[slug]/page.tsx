'use client';
import { notFound } from 'next/navigation';
import { use, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faFloppyDisk,
  faPlay,
  faStop,
  faCircleInfo,
  faBug,
} from '@fortawesome/free-solid-svg-icons';
import { Badge } from '@/modules/ui/Badge';
import { RulesetEditor } from '@/modules/domains/iot/ruleset/RulesetEditor';
import type { RulesetEditorRef } from '@/modules/domains/iot/ruleset/RulesetEditor';
import { RULE_CHAINS } from '../../iot.data';
import { DocumentTitle } from '@/libs/utils/DocumentTitle';

export default function RulesetEditorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const chain = RULE_CHAINS.find((c) => c.slug === slug);
  if (!chain) notFound();

  const editorRef = useRef<RulesetEditorRef>(null);

  return (
    <>
      <DocumentTitle text={`${chain.name} — IoT Theme`} />
      <div className="flex flex-col h-full overflow-hidden">

      {/* ── Toolbar ── */}
      <div className="shrink-0 flex items-center gap-3 border-b border-border bg-surface-base px-4 py-2.5">
        <a
          href="/theme/iot/rulesets"
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="w-3.5 h-3.5" aria-hidden="true" />
          Rulesets
        </a>

        <span className="text-border-strong">·</span>

        <h1 className="text-sm font-semibold text-text-primary">{chain.name}</h1>

        <Badge variant={chain.active ? 'success' : 'neutral'} size="sm" dot className="hidden sm:inline-flex">
          {chain.active ? 'Active' : 'Inactive'}
        </Badge>

        <div className="ml-auto flex items-center gap-2">
          <span className="hidden md:block text-xs text-text-secondary">
            {chain.nodes.length} nodes · {chain.edges.length} edges
          </span>

          {/* Debug chain */}
          <button
            onClick={() => editorRef.current?.openRulesetDebug()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-secondary hover:border-primary hover:text-primary transition-colors"
          >
            <FontAwesomeIcon icon={faBug} className="w-3 h-3" aria-hidden="true" />
            Debug
          </button>

          {/* Toggle active */}
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-secondary hover:border-primary hover:text-primary transition-colors">
            <FontAwesomeIcon icon={chain.active ? faStop : faPlay} className="w-3 h-3" aria-hidden="true" />
            {chain.active ? 'Deactivate' : 'Activate'}
          </button>

          {/* Save */}
          <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-fg hover:bg-primary-hover transition-colors">
            <FontAwesomeIcon icon={faFloppyDisk} className="w-3 h-3" aria-hidden="true" />
            Save
          </button>
        </div>
      </div>

      {/* ── Hint bar ── */}
      <div className="shrink-0 flex items-center gap-2 border-b border-border bg-surface-raised px-4 py-1.5">
        <FontAwesomeIcon icon={faCircleInfo} className="w-3 h-3 text-text-secondary shrink-0" aria-hidden="true" />
        <p className="text-[11px] text-text-secondary">
          Drag nodes from the palette · Click <span className="font-semibold text-primary">●</span> output → <span className="font-semibold">○</span> input to connect · Click a node to edit its script · Click <span className="font-semibold">🐛 Debug</span> to trace execution
        </p>
      </div>

      {/* ── Editor canvas ── */}
      <div className="flex-1 min-h-0">
        <RulesetEditor
          ref={editorRef}
          initialNodes={chain.nodes}
          initialEdges={chain.edges}
          chainName={chain.name}
          className="h-full"
        />
      </div>
      </div>
    </>
  );
}
