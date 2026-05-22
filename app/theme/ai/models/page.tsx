'use client';
import { useState } from 'react';
import { SearchBar } from '@/modules/ui/SearchBar';
import { Badge } from '@/modules/ui/Badge';
import { ModelCard } from '@/modules/domains/ai/model/ModelCard';
import type { AIModelType } from '@/modules/domains/ai/types';
import { MODELS } from '../ai.data';
import { DocumentTitle } from '@/libs/utils/DocumentTitle';

const MODEL_TYPES: { label: string; value: AIModelType | 'ALL' }[] = [
  { label: 'All',       value: 'ALL'       },
  { label: 'Text',      value: 'TEXT'      },
  { label: 'Image',     value: 'IMAGE'     },
  { label: 'Embedding', value: 'EMBEDDING' },
  { label: 'Audio',     value: 'AUDIO'     },
  { label: 'Video',     value: 'VIDEO'     },
];

export default function ModelsPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<AIModelType | 'ALL'>('ALL');

  const filtered = MODELS.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.provider.toLowerCase().includes(search.toLowerCase()) ||
      m.modelId.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'ALL' || m.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <>
      <DocumentTitle text="Models — AI Theme" />
      <div className="mx-auto max-w-7xl px-6 py-12">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary">AI Models</h1>
        <p className="mt-2 text-text-secondary">
          Browse all available models across providers. Click a model to see full details.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="flex-1 max-w-sm">
          <SearchBar
            value={search}
            onChange={setSearch}
            onClear={() => setSearch('')}
            placeholder="Search by name, provider…"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {MODEL_TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setTypeFilter(t.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus ${
                typeFilter === t.value
                  ? 'bg-primary text-primary-fg border-primary'
                  : 'bg-surface-raised text-text-secondary border-border hover:border-border-focus hover:text-text-primary'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4 flex items-center gap-2">
        <Badge variant="neutral" size="sm">{filtered.length} model{filtered.length !== 1 ? 's' : ''}</Badge>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((model) => (
            <ModelCard
              key={model.modelId}
              model={model}
              href={`/theme/ai/models/${model.modelId}`}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-text-secondary">
          <p className="text-lg font-medium">No models found</p>
          <p className="mt-1 text-sm">Try adjusting your search or filter.</p>
        </div>
      )}
      </div>
    </>
  );
}
