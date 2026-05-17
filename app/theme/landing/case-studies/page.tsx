import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { CaseStudyCard } from '@/modules/domains/landing/case-study/CaseStudyCard';
import { MetricsCallout } from '@/modules/domains/landing/case-study/MetricsCallout';

const CASE_STUDIES = [
  {
    company: 'Northwind Logistics',
    industry: 'Logistics',
    headline: 'Cut routing latency 4× with on-edge inference',
    summary: 'After moving their classifier to Edge Functions, Northwind shaved routing decisions from 800ms to 195ms — fast enough to dispatch drivers in real time.',
    keyResult: '4× faster routing, 31% fewer empty miles',
    slug: 'northwind-logistics',
  },
  {
    company: 'Atlas Insurance',
    industry: 'Fintech',
    headline: 'Onboarded 12k agents in a quarter without a hiring spree',
    summary: 'Self-serve onboarding plus role-aware dashboards meant Atlas could scale their broker network without scaling their support desk.',
    keyResult: '12,000 brokers in 90 days · −42% support tickets',
    slug: 'atlas-insurance',
  },
  {
    company: 'Rivermint Studios',
    industry: 'Gaming',
    headline: 'Shipped weekly releases from a single content repo',
    summary: 'Rivermint replaced three CMS instances with a content-as-code workflow. Editors now publish via a typed UI; engineering reviews diffs in GitHub.',
    keyResult: '7× release cadence, zero CMS outages',
    slug: 'rivermint-studios',
  },
];

const AGGREGATE_METRICS = [
  { value: '37%', label: 'Avg. conversion lift',      helper: 'across 84 launches' },
  { value: '4.2×', label: 'Faster time-to-market',     helper: 'vs. previous stack' },
  { value: '−68%', label: 'Support cost',              helper: 'after self-serve flows' },
  { value: '99.97%', label: 'P95 uptime',              helper: 'past 12 months' },
];

export default function CaseStudiesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <a
        href="/theme/landing"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary mb-4 transition-colors"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-3" aria-hidden="true" />
        Back home
      </a>

      <header className="mb-10 max-w-3xl">
        <p className="text-xs uppercase tracking-wide font-semibold text-primary">Case studies</p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-text-primary leading-tight">
          Real teams. Real results.
        </h1>
        <p className="mt-3 text-base text-text-secondary leading-relaxed">
          Read how product teams use our platform to ship faster, scale smarter, and turn customer
          feedback into shipped features in days — not months.
        </p>
      </header>

      <div className="mb-12">
        <MetricsCallout title="Across our customers" metrics={AGGREGATE_METRICS} />
      </div>

      <section aria-label="Customer stories" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CASE_STUDIES.map((cs) => (
          <CaseStudyCard
            key={cs.slug}
            company={cs.company}
            industry={cs.industry}
            headline={cs.headline}
            summary={cs.summary}
            keyResult={cs.keyResult}
            href={`/theme/landing/case-studies#${cs.slug}`}
          />
        ))}
      </section>
    </div>
  );
}
