'use client';
import { cn } from '@/libs/utils/cn';
import { ModelProviderBadge } from '../model/ModelProviderBadge';
import { FeatureCheckCell, type FeatureCheckValue } from './FeatureCheckCell';
import { ModelScoreSparkline } from './ModelScoreSparkline';
import type { AIModel } from '../types';

export type ModelComparisonRow = {
  model: AIModel;
  benchmarkScores: number[];
  features: Record<string, FeatureCheckValue>;
  /** Headline benchmark score (0-100). */
  headlineScore?: number;
};

export type ModelComparisonTableProps = {
  rows: ModelComparisonRow[];
  /** Ordered feature keys to display as columns. */
  featureKeys: { key: string; label: string }[];
  className?: string;
};

export function ModelComparisonTable({ rows, featureKeys, className }: ModelComparisonTableProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-surface-raised overflow-x-auto',
        className,
      )}
    >
      <table className="w-full text-sm" role="table">
        <thead className="bg-surface-overlay text-text-secondary text-xs uppercase tracking-wider">
          <tr>
            <th scope="col" className="text-left font-semibold px-4 py-3 sticky left-0 bg-surface-overlay">
              Model
            </th>
            <th scope="col" className="text-left font-semibold px-4 py-3 whitespace-nowrap">
              Context
            </th>
            <th scope="col" className="text-left font-semibold px-4 py-3 whitespace-nowrap">
              Price · in / out
            </th>
            <th scope="col" className="text-left font-semibold px-4 py-3 whitespace-nowrap">
              Benchmark trend
            </th>
            {featureKeys.map((f) => (
              <th
                key={f.key}
                scope="col"
                className="text-center font-semibold px-4 py-3 whitespace-nowrap"
              >
                {f.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(({ model, benchmarkScores, features, headlineScore }, i) => (
            <tr
              key={model.modelId}
              className={cn(
                'border-t border-border',
                i % 2 === 1 && 'bg-surface-base/40',
              )}
            >
              <th
                scope="row"
                className="text-left font-semibold text-text-primary px-4 py-3 align-middle sticky left-0 bg-surface-raised"
              >
                <div className="flex items-center gap-2">
                  <div className="min-w-0">
                    <p className="truncate">{model.name}</p>
                    <p className="font-mono text-[10px] font-normal text-text-secondary truncate">
                      {model.modelId}
                    </p>
                  </div>
                  <ModelProviderBadge provider={model.provider} size="sm" />
                </div>
              </th>
              <td className="px-4 py-3 align-middle whitespace-nowrap text-text-primary">
                {model.contextWindow
                  ? `${(model.contextWindow / 1000).toFixed(0)}k`
                  : '—'}
              </td>
              <td className="px-4 py-3 align-middle whitespace-nowrap text-text-primary">
                {model.pricingPromptPer1k != null
                  ? `$${model.pricingPromptPer1k.toFixed(4)}`
                  : '—'}
                <span className="text-text-secondary"> / </span>
                {model.pricingCompletionPer1k != null
                  ? `$${model.pricingCompletionPer1k.toFixed(4)}`
                  : '—'}
              </td>
              <td className="px-4 py-3 align-middle">
                <div className="flex items-center gap-3">
                  <ModelScoreSparkline scores={benchmarkScores} width={80} height={28} />
                  {headlineScore != null && (
                    <span className="font-mono text-xs font-semibold text-text-primary">
                      {headlineScore.toFixed(1)}
                    </span>
                  )}
                </div>
              </td>
              {featureKeys.map((f) => (
                <td key={f.key} className="px-4 py-3 align-middle text-center">
                  <FeatureCheckCell value={features[f.key] ?? 'no'} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
