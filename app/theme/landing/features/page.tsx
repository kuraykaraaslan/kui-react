import type { Metadata } from 'next';
import { Breadcrumb } from '@/modules/ui/Breadcrumb';
import { FeatureGrid } from '@/modules/domains/landing/feature/FeatureGrid';
import { HowItWorksSection } from '@/modules/domains/landing/how-it-works/HowItWorksSection';
import { TestimonialGrid } from '@/modules/domains/landing/testimonial/TestimonialGrid';
import { FEATURES, TESTIMONIALS, HOW_IT_WORKS_STEPS } from '../landing.data';
import { buildPageTitle, THEME_TITLES } from '@/libs/config/showcase.config';

export const metadata: Metadata = {
  title: buildPageTitle('Features', THEME_TITLES.landing),
};

const BASE = '/theme/landing';

export default function FeaturesPage() {
  return (
    <div className="bg-surface-base text-text-primary">

      {/* Page header */}
      <div className="border-b border-border bg-surface-raised">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <Breadcrumb
            items={[
              { label: 'Velox', href: BASE },
              { label: 'Features' },
            ]}
            className="mb-4"
          />
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
            Everything your team needs
          </h1>
          <p className="mt-3 max-w-2xl text-base text-text-secondary leading-relaxed">
            Velox is built around the way modern engineering teams actually work — fast iterations,
            collaborative reviews, and zero tolerance for downtime.
          </p>
        </div>
      </div>

      {/* All 6 features */}
      <FeatureGrid
        eyebrow="Core capabilities"
        title="One platform for the entire workflow"
        subtitle="From the first commit to the production deploy — and everything that happens after."
        features={FEATURES}
        columns={3}
        className="bg-surface-base"
      />

      {/* How it works — vertical timeline for detail */}
      <div className="bg-surface-raised">
        <HowItWorksSection
          eyebrow="Step by step"
          title="Up and running in minutes"
          subtitle="No YAML rewrites, no oncall surprise. Just connect and go."
          steps={HOW_IT_WORKS_STEPS}
          layout="vertical"
        />
      </div>

      {/* What engineers say */}
      <TestimonialGrid
        eyebrow="From the field"
        title="What engineers say"
        testimonials={TESTIMONIALS}
      />

      {/* CTA */}
      <section className="bg-primary py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold text-primary-fg tracking-tight">
            Try every feature free for 14 days
          </h2>
          <p className="mt-3 text-base text-primary-fg/80">
            No credit card required. Full Pro access from day one.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={`${BASE}/pricing`}
              className="inline-flex items-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-primary hover:bg-primary-subtle transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              View pricing
            </a>
            <a
              href="#"
              className="inline-flex items-center rounded-xl border border-white/40 px-6 py-3 text-sm font-semibold text-primary-fg hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Start free trial
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
