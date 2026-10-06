'use client';
import { useMemo, useState } from 'react';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Modal } from '@/modules/ui/Modal';
import { Input } from '@/modules/ui/Input';
import { paletteGroups } from '../../catalog/palette';
import type { Catalog } from '../../catalog/types';
import { lookOf } from '../block-visual';
import { SecondaryButton } from './buttons';
import { useFocusOnMount } from './useFocusOnMount';

/** A searchable list of the blocks of a catalog, for "add a block here" and "add a block in between". */
export function BlockPickerDialog({ title, catalog, addProblem, onPick, onClose }: {
  title: string;
  catalog: Catalog;
  addProblem?: (type: string) => string | null;
  onPick: (type: string) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const searchRef = useFocusOnMount<HTMLInputElement>();
  const groups = useMemo(() => paletteGroups(catalog, query), [catalog, query]);
  return (
    <Modal open onClose={onClose} title={title} size="md" scrollable
      footer={<SecondaryButton onClick={onClose}>Cancel</SecondaryButton>}>
      <div className="space-y-3">
        <Input id="block-picker-search" label="Search blocks" type="search" value={query} ref={searchRef} placeholder="Name, description or type" onChange={(e) => setQuery(e.target.value)} />
        {groups.map((g) => (
          <section key={g.id} aria-label={g.label}>
            <h3 className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-text-secondary">{g.label}</h3>
            <ul className="grid gap-1.5 sm:grid-cols-2">
              {g.blocks.map((block) => {
                const look = lookOf(block);
                const problem = addProblem?.(block.type) ?? null;
                return (
                  <li key={block.type}>
                    <button
                      type="button" disabled={!!problem} title={problem ?? block.description} onClick={() => onPick(block.type)}
                      className={cn('flex w-full items-start gap-2.5 rounded-lg border border-border bg-surface-base px-3 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
                        problem ? 'cursor-not-allowed opacity-50' : 'hover:border-primary hover:bg-primary-subtle')}>
                      <FontAwesomeIcon icon={look.icon} className={cn('mt-0.5 h-3.5 w-3.5 shrink-0', look.iconColor)} aria-hidden="true" />
                      <span className="min-w-0">
                        <span className="block truncate text-xs font-semibold text-text-primary">{block.title}</span>
                        {block.description && <span className="line-clamp-2 block text-[11px] text-text-secondary">{block.description}</span>}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
        {!groups.length && <p className="text-xs text-text-secondary">No block matches.</p>}
      </div>
    </Modal>
  );
}
