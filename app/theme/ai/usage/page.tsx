import type { Metadata } from 'next';
import { StatCard } from '@/modules/ui/StatCard';
import { Table } from '@/modules/ui/Table';
import { UsageStatsCard } from '@/modules/domains/ai/usage/UsageStatsCard';
import { USAGES } from '../ai.data';
import { buildPageTitle, THEME_TITLES } from '@/libs/config/showcase.config';

export const metadata: Metadata = {
  title: buildPageTitle('Usage', THEME_TITLES.ai),
};

const TABLE_COLUMNS = [
  { key: 'modelId',          header: 'Model'            },
  { key: 'tokensPrompt',     header: 'Prompt Tokens'    },
  { key: 'tokensCompletion', header: 'Completion Tokens' },
  { key: 'totalTokens',      header: 'Total Tokens'      },
  { key: 'cost',             header: 'Cost'              },
  { key: 'date',             header: 'Date'              },
];

export default function UsagePage() {
  const totalTokens = USAGES.reduce(
    (acc, u) => acc + u.tokensPrompt + u.tokensCompletion,
    0
  );
  const totalCost = USAGES.reduce((acc, u) => acc + u.cost, 0);
  const uniqueModels = new Set(USAGES.map((u) => u.modelId)).size;

  const tableRows = USAGES.map((u) => ({
    modelId: u.modelId,
    tokensPrompt: u.tokensPrompt.toLocaleString(),
    tokensCompletion: u.tokensCompletion.toLocaleString(),
    totalTokens: (u.tokensPrompt + u.tokensCompletion).toLocaleString(),
    cost: `$${u.cost.toFixed(6)}`,
    date: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—',
  }));

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary">Usage Dashboard</h1>
        <p className="mt-2 text-text-secondary">
          Monitor your AI token consumption and cost across all models.
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard
          label="Total tokens"
          value={totalTokens.toLocaleString()}
          accent="text-primary"
        />
        <StatCard
          label="Total cost"
          value={`$${totalCost.toFixed(4)}`}
          accent="text-success-fg"
        />
        <StatCard
          label="Models used"
          value={uniqueModels}
          accent="text-text-primary"
        />
        <StatCard
          label="Usage records"
          value={USAGES.length}
          accent="text-text-secondary"
        />
      </div>

      {/* Usage table */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-text-primary mb-4">All Usage Records</h2>
        <div className="rounded-xl border border-border overflow-hidden">
          <Table columns={TABLE_COLUMNS} rows={tableRows} />
        </div>
      </section>

      {/* Per-record stat cards */}
      <section>
        <h2 className="text-lg font-semibold text-text-primary mb-4">Usage Detail Cards</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {USAGES.map((usage) => (
            <UsageStatsCard key={usage.usageId} usage={usage} />
          ))}
        </div>
      </section>
    </div>
  );
}
