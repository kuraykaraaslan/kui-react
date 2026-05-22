'use client';
import { useState, useId } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDiagramProject,
  faPlus,
  faPenToSquare,
  faTrash,
  faPlay,
  faStop,
  faCircleInfo,
} from '@fortawesome/free-solid-svg-icons';
import { DataTable } from '@/modules/ui/DataTable';
import type { TableColumn } from '@/modules/ui/DataTable';
import { Modal } from '@/modules/ui/Modal';
import { Badge } from '@/modules/ui/Badge';
import { Input } from '@/modules/ui/Input';
import { Textarea } from '@/modules/ui/Textarea';
import { Button } from '@/modules/ui/Button';
import { RULE_CHAINS } from '../iot.data';
import type { RuleChain } from '@/modules/domains/iot/types';
import { DocumentTitle } from '@/libs/utils/DocumentTitle';

/* ─── Row type for DataTable ─────────────────────────────────────────────── */

type ChainRow = {
  chainId: string;
  name: string;
  slug: string;
  description: string;
  active: boolean;
  nodes: number;
  edges: number;
  updatedAt: string;
  [key: string]: unknown; // satisfies Record<string, unknown>
};

function toRow(c: RuleChain): ChainRow {
  return {
    chainId: c.chainId,
    name: c.name,
    slug: c.slug,
    description: c.description ?? '',
    active: c.active,
    nodes: c.nodes.length,
    edges: c.edges.length,
    updatedAt: c.updatedAt
      ? new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' }).format(new Date(c.updatedAt))
      : '—',
  };
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function RulesetsPage() {
  const [chains, setChains] = useState<RuleChain[]>(RULE_CHAINS);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [nameError, setNameError] = useState('');
  const formId = useId();

  const rows: ChainRow[] = chains.map(toRow);

  /* ─── CRUD ── */

  function handleCreate() {
    const trimmed = newName.trim();
    if (!trimmed) { setNameError('Name is required.'); return; }
    if (chains.some((c) => c.name.toLowerCase() === trimmed.toLowerCase())) {
      setNameError('A ruleset with this name already exists.');
      return;
    }
    const now = new Date();
    const newChain: RuleChain = {
      chainId: `chain-${Date.now()}`,
      name: trimmed,
      slug: slugify(trimmed) || `chain-${Date.now()}`,
      description: newDesc.trim() || undefined,
      active: false,
      nodes: [],
      edges: [],
      createdAt: now,
      updatedAt: now,
    };
    setChains((p) => [...p, newChain]);
    setNewName('');
    setNewDesc('');
    setNameError('');
    setModalOpen(false);
  }

  function handleToggle(chainId: string) {
    setChains((p) =>
      p.map((c) => c.chainId === chainId ? { ...c, active: !c.active, updatedAt: new Date() } : c)
    );
  }

  function handleDelete(chainId: string) {
    setChains((p) => p.filter((c) => c.chainId !== chainId));
    setDeleteTarget(null);
  }

  /* ─── Columns ── */

  const columns: TableColumn<ChainRow>[] = [
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      render: (row) => (
        <a
          href={`/theme/iot/rulesets/${row.slug}`}
          className="inline-flex items-center gap-2 font-medium text-text-primary hover:text-primary transition-colors"
        >
          <FontAwesomeIcon icon={faDiagramProject} className="w-3.5 h-3.5 text-text-secondary shrink-0" aria-hidden="true" />
          {row.name}
        </a>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (row) => (
        <span className="text-text-secondary max-w-xs line-clamp-1 block">
          {row.description || <span className="italic opacity-50">—</span>}
        </span>
      ),
    },
    {
      key: 'active',
      header: 'Status',
      align: 'center',
      sortable: true,
      render: (row) => (
        <Badge variant={row.active ? 'success' : 'neutral'} size="sm" dot>
          {row.active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'nodes',
      header: 'Nodes',
      align: 'center',
      sortable: true,
      render: (row) => (
        <span className="tabular-nums text-text-secondary">{row.nodes}</span>
      ),
    },
    {
      key: 'edges',
      header: 'Edges',
      align: 'center',
      sortable: true,
      render: (row) => (
        <span className="tabular-nums text-text-secondary">{row.edges}</span>
      ),
    },
    {
      key: 'updatedAt',
      header: 'Last Updated',
      sortable: true,
      render: (row) => (
        <span className="text-text-secondary whitespace-nowrap">{row.updatedAt}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            as="a"
            href={`/theme/iot/rulesets/${row.slug}`}
            variant="ghost"
            size="xs"
            iconOnly
            aria-label="Edit ruleset"
            title="Open editor"
          >
            <FontAwesomeIcon icon={faPenToSquare} className="w-3.5 h-3.5" aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="xs"
            iconOnly
            aria-label={row.active ? 'Deactivate' : 'Activate'}
            title={row.active ? 'Deactivate' : 'Activate'}
            onClick={() => handleToggle(row.chainId)}
          >
            <FontAwesomeIcon
              icon={row.active ? faStop : faPlay}
              className={`w-3.5 h-3.5 ${row.active ? 'text-warning' : 'text-success-fg'}`}
              aria-hidden="true"
            />
          </Button>
          <Button
            variant="ghost"
            size="xs"
            iconOnly
            aria-label="Delete ruleset"
            title="Delete"
            onClick={() => setDeleteTarget(row.chainId)}
            className="hover:text-error"
          >
            <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" aria-hidden="true" />
          </Button>
        </div>
      ),
    },
  ];

  /* ─── Render ── */

  const deleteChain = chains.find((c) => c.chainId === deleteTarget);

  return (
    <>
      <DocumentTitle text="Rulesets — IoT Theme" />
      <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">

        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-text-primary">Rulesets</h1>
            <p className="text-sm text-text-secondary mt-0.5">
              {chains.length} rule {chains.length === 1 ? 'chain' : 'chains'} ·{' '}
              {chains.filter((c) => c.active).length} active
            </p>
          </div>
          <Button variant="primary" size="sm" onClick={() => setModalOpen(true)}>
            <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" aria-hidden="true" />
            New Ruleset
          </Button>
        </div>

        {/* Info bar */}
        <div className="flex items-start gap-3 rounded-xl border border-primary/30 bg-primary-subtle px-4 py-3">
          <FontAwesomeIcon icon={faCircleInfo} className="w-4 h-4 text-primary mt-0.5 shrink-0" aria-hidden="true" />
          <p className="text-sm text-text-primary">
            Rule chains process device telemetry in real time through a visual pipeline of{' '}
            <strong>Triggers</strong>, <strong>Filters</strong>, <strong>Transforms</strong>, and{' '}
            <strong>Actions</strong>. Click a name to open the drag-and-drop editor.
          </p>
        </div>

        {/* DataTable */}
        <DataTable
          columns={columns}
          rows={rows}
          searchPlaceholder="Search rulesets…"
          pageSize={10}
          emptyMessage="No rulesets yet. Create one to get started."
          caption="Rule chains"
        />
      </div>

      {/* ── Create modal ── */}
      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setNewName(''); setNewDesc(''); setNameError(''); }}
        title="New Ruleset"
        description="Define a new rule chain. You can add nodes and connections in the editor."
        size="sm"
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => { setModalOpen(false); setNewName(''); setNewDesc(''); setNameError(''); }}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleCreate}>
              Create Ruleset
            </Button>
          </div>
        }
      >
        <form
          id={formId}
          className="space-y-4"
          onSubmit={(e) => { e.preventDefault(); handleCreate(); }}
        >
          <Input
            id={`${formId}-name`}
            label="Name"
            placeholder="e.g. Temperature Alert"
            value={newName}
            onChange={(e) => { setNewName(e.target.value); setNameError(''); }}
            error={nameError || undefined}
            required
          />
          <Textarea
            id={`${formId}-desc`}
            label="Description"
            placeholder="Briefly describe what this rule chain does…"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            rows={3}
          />
        </form>
      </Modal>

      {/* ── Delete confirm modal ── */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Ruleset"
        size="sm"
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={() => deleteTarget && handleDelete(deleteTarget)}>
              <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" aria-hidden="true" />
              Delete
            </Button>
          </div>
        }
      >
        <p className="text-sm text-text-primary">
          Are you sure you want to delete{' '}
          <strong>{deleteChain?.name}</strong>? This will remove all{' '}
          {deleteChain?.nodes.length ?? 0} nodes and {deleteChain?.edges.length ?? 0} connections.
          This action cannot be undone.
        </p>
      </Modal>
      </div>
    </>
  );
}
