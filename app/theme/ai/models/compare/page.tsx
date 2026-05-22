import type { Metadata } from 'next';
import { ModelComparisonTable, type ModelComparisonRow } from '@/modules/domains/ai/compare/ModelComparisonTable';
import { ModelScoreSparkline } from '@/modules/domains/ai/compare/ModelScoreSparkline';
import { FeatureCheckCell } from '@/modules/domains/ai/compare/FeatureCheckCell';
import { Badge } from '@/modules/ui/Badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faTrophy, faClockRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { MODELS } from '../../ai.data';
import type { AIModel } from '@/modules/domains/ai/types';
import { buildPageTitle, THEME_TITLES } from '@/libs/config/showcase.config';

export const metadata: Metadata = {
  title: buildPageTitle('Model Comparison', THEME_TITLES.ai),
  description: 'Side-by-side comparison of frontier AI models on price, context window, and benchmarks.',
};

const EXTRA_MODELS: AIModel[] = [
  {
    modelId: 'claude-3.7-sonnet',
    provider: 'ANTHROPIC',
    name: 'Claude 3.7 Sonnet',
    type: 'TEXT',
    contextWindow: 200000,
    maxOutputTokens: 8192,
    pricingPromptPer1k: 0.003,
    pricingCompletionPer1k: 0.015,
    active: true,
  },
  {
    modelId: 'gpt-5-mini',
    provider: 'OPENAI',
    name: 'GPT-5 Mini',
    type: 'TEXT',
    contextWindow: 256000,
    maxOutputTokens: 8192,
    pricingPromptPer1k: 0.0008,
    pricingCompletionPer1k: 0.0032,
    active: true,
  },
  {
    modelId: 'gemini-2.0-pro',
    provider: 'GOOGLE',
    name: 'Gemini 2.0 Pro',
    type: 'TEXT',
    contextWindow: 1000000,
    maxOutputTokens: 8192,
    pricingPromptPer1k: 0.00125,
    pricingCompletionPer1k: 0.005,
    active: true,
  },
];

const TEXT_MODELS: AIModel[] = [
  ...MODELS.filter((m) => m.type === 'TEXT'),
  ...EXTRA_MODELS,
];

const COMPARISON_DATA: ModelComparisonRow[] = [
  {
    model: TEXT_MODELS[0],
    benchmarkScores: [58, 65, 70, 76, 81, 84, 87, 90],
    headlineScore: 90.1,
    features: { vision: 'yes', tools: 'yes', json: 'yes', streaming: 'yes', cache: 'yes' },
  },
  {
    model: TEXT_MODELS[1],
    benchmarkScores: [50, 56, 62, 68, 72, 76, 80, 83],
    headlineScore: 83.4,
    features: { vision: 'partial', tools: 'yes', json: 'yes', streaming: 'yes', cache: 'preview' },
  },
  {
    model: TEXT_MODELS[2],
    benchmarkScores: [55, 62, 67, 72, 76, 79, 82, 85],
    headlineScore: 84.9,
    features: { vision: 'yes', tools: 'yes', json: 'yes', streaming: 'yes', cache: 'yes' },
  },
  {
    model: TEXT_MODELS[3],
    benchmarkScores: [60, 65, 69, 74, 78, 82, 85, 89],
    headlineScore: 88.7,
    features: { vision: 'yes', tools: 'yes', json: 'yes', streaming: 'yes', cache: 'yes' },
  },
  {
    model: TEXT_MODELS[4],
    benchmarkScores: [56, 61, 65, 70, 74, 78, 81, 86],
    headlineScore: 85.6,
    features: { vision: 'yes', tools: 'partial', json: 'yes', streaming: 'yes', cache: 'preview' },
  },
  {
    model: TEXT_MODELS[5],
    benchmarkScores: [54, 60, 64, 69, 73, 77, 80, 84],
    headlineScore: 84.2,
    features: { vision: 'yes', tools: 'partial', json: 'yes', streaming: 'yes', cache: 'no' },
  },
];

const FEATURE_KEYS = [
  { key: 'vision', label: 'Vision' },
  { key: 'tools', label: 'Tools' },
  { key: 'json', label: 'JSON' },
  { key: 'streaming', label: 'Stream' },
  { key: 'cache', label: 'Cache' },
];

const BENCHMARKS = [
  {
    name: 'MMLU',
    description: 'General reasoning across 57 academic subjects.',
    leader: COMPARISON_DATA[0],
    scores: COMPARISON_DATA[0].benchmarkScores,
  },
  {
    name: 'HumanEval',
    description: 'Functional correctness of Python code generation.',
    leader: COMPARISON_DATA[3],
    scores: COMPARISON_DATA[3].benchmarkScores,
  },
  {
    name: 'GSM8K',
    description: 'Grade-school math word problems.',
    leader: COMPARISON_DATA[2],
    scores: COMPARISON_DATA[2].benchmarkScores,
  },
];

export default function CompareModelsPage() {
  const sortedByScore = [...COMPARISON_DATA].sort(
    (a, b) => (b.headlineScore ?? 0) - (a.headlineScore ?? 0),
  );

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Compare AI Models</h1>
          <p className="mt-2 text-text-secondary max-w-2xl">
            Benchmark scores, pricing and capability matrix across frontier text models.
            Updated weekly from our internal evaluation harness.
          </p>
        </div>
        <Badge variant="info" size="md" dot>
          <FontAwesomeIcon icon={faClockRotateLeft} className="w-3 h-3 mr-1" aria-hidden="true" />
          Updated 17 May 2026
        </Badge>
      </div>

      {/* Leader cards */}
      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        {sortedByScore.slice(0, 3).map((row, i) => (
          <div
            key={row.model.modelId}
            className="rounded-xl border border-border bg-surface-raised p-4 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <Badge variant={i === 0 ? 'success' : 'neutral'} size="sm">
                <FontAwesomeIcon icon={faTrophy} className="w-3 h-3 mr-1" aria-hidden="true" />
                #{i + 1} overall
              </Badge>
              <span className="font-mono text-2xl font-bold text-text-primary">
                {row.headlineScore?.toFixed(1)}
              </span>
            </div>
            <p className="font-semibold text-text-primary">{row.model.name}</p>
            <ModelScoreSparkline scores={row.benchmarkScores} width={240} height={36} />
          </div>
        ))}
      </div>

      {/* Benchmarks */}
      <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
        <FontAwesomeIcon icon={faChartLine} className="w-4 h-4 text-primary" aria-hidden="true" />
        Benchmark suites
      </h2>
      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        {BENCHMARKS.map((b) => (
          <div
            key={b.name}
            className="rounded-xl border border-border bg-surface-raised p-4 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <p className="font-semibold text-text-primary">{b.name}</p>
              <FeatureCheckCell value="yes" label={`Leader · ${b.leader.model.name}`} />
            </div>
            <p className="text-xs text-text-secondary leading-snug">{b.description}</p>
            <ModelScoreSparkline scores={b.scores} width={260} height={40} label="8-week trend" />
          </div>
        ))}
      </div>

      {/* Main comparison table */}
      <h2 className="text-xl font-bold text-text-primary mb-4">Full comparison</h2>
      <ModelComparisonTable rows={COMPARISON_DATA} featureKeys={FEATURE_KEYS} />

      <p className="mt-4 text-xs text-text-secondary">
        Pricing per 1k tokens, USD. Benchmark scores are the model&apos;s most recent
        score on each suite (higher is better, max 100).
      </p>
    </div>
  );
}
