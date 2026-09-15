'use client';
import { Statistic } from '@/modules/ui/Statistic';
import type { ShowcaseComponent } from '../showcase.types';

export function buildStatisticData(): ShowcaseComponent[] {
  return [
    {
      id: 'statistic',
      title: 'Statistic',
      category: 'Atom',
      abbr: 'St',
      description: 'Bare numeric/text figure with a label, optional prefix/suffix, trend indicator, and loading skeleton — no card chrome (compose with Card for a bordered KPI tile).',
      filePath: 'modules/ui/Statistic.tsx',
      since: '2026-09',
      relatedTo: ['stat-card'],
      sourceCode: `'use client';
import { Statistic } from '@/modules/ui/Statistic';

<Statistic label="Active users" value={1284} />
<Statistic label="Conversion rate" value={4.2} precision={1} suffix="%" trend="up" trendValue="+0.6%" />
<Statistic label="Revenue" value={82400} prefix="$" trend="down" trendValue="-3.1%" />`,
      variants: [
        {
          title: 'Basic',
          preview: (
            <div className="flex flex-wrap gap-8">
              <Statistic label="Active users" value={1284} />
              <Statistic label="Open tickets" value={12} />
            </div>
          ),
          code: `<Statistic label="Active users" value={1284} />\n<Statistic label="Open tickets" value={12} />`,
        },
        {
          title: 'Prefix / suffix / trend',
          preview: (
            <div className="flex flex-wrap gap-8">
              <Statistic label="Revenue" value={82400} prefix="$" trend="up" trendValue="+12.4%" />
              <Statistic label="Conversion rate" value={4.2} precision={1} suffix="%" trend="down" trendValue="-0.6%" />
              <Statistic label="Loading example" value={0} loading />
            </div>
          ),
          code: `<Statistic label="Revenue" value={82400} prefix="$" trend="up" trendValue="+12.4%" />\n<Statistic label="Conversion rate" value={4.2} precision={1} suffix="%" trend="down" trendValue="-0.6%" />\n<Statistic label="Loading example" value={0} loading />`,
        },
      ],
    },
  ];
}
