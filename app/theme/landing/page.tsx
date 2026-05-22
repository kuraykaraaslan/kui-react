import type { Metadata } from 'next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { HeroSection } from '@/modules/domains/landing/hero/HeroSection';
import { FeatureGrid } from '@/modules/domains/landing/feature/FeatureGrid';
import { HowItWorksSection } from '@/modules/domains/landing/how-it-works/HowItWorksSection';
import { TestimonialGrid } from '@/modules/domains/landing/testimonial/TestimonialGrid';
import { StatsBar } from '@/modules/domains/landing/stat/StatsBar';
import { PartnerLogosStrip } from '@/modules/domains/landing/partner/PartnerLogosStrip';
import {
  HERO,
  FEATURES,
  TESTIMONIALS,
  STATS,
  PARTNERS,
  HOW_IT_WORKS_STEPS,
} from './landing.data';
import { THEME_TITLES } from '@/libs/config/showcase.config';

export const metadata: Metadata = {
  title: { absolute: THEME_TITLES.landing },
};

const BASE = '/theme/landing';

export default function LandingHomePage() {
  return (
    <div className="bg-surface-base text-text-primary">

      <HeroSection hero={HERO} />

      <PartnerLogosStrip
        label="Trusted by teams at"
        partners={PARTNERS}
        className="border-y border-border bg-surface-raised"
      />

      <StatsBar stats={STATS} />

      {/* Feature teaser — 3 cards + link to /features */}
      <FeatureGrid
        eyebrow="What you get"
        title="Built for teams that move fast"
        subtitle="No more juggling five tabs. Velox brings your whole shipping workflow into one cohesive experience."
        features={FEATURES.slice(0, 3)}
        columns={3}
        className="bg-surface-base"
      />
      <div className="flex justify-center pb-16 -mt-6">
        <a
          href={`${BASE}/features`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus rounded"
        >
          See all features
          <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5" aria-hidden="true" />
        </a>
      </div>

      <div className="bg-surface-raised">
        <HowItWorksSection
          eyebrow="Getting started"
          title="From repo to production in 3 steps"
          subtitle="Set up in minutes, not days. No DevOps PhD required."
          steps={HOW_IT_WORKS_STEPS}
          layout="horizontal"
        />
      </div>

      {/* Testimonial teaser — first 3 + link */}
      <TestimonialGrid
        eyebrow="What teams say"
        title="Loved by engineers worldwide"
        subtitle="Over 5 000 teams have shipped with Velox. Here is what they have to say."
        testimonials={TESTIMONIALS.slice(0, 3)}
      />

      {/* CTA banner */}
      <section className="bg-primary py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-fg tracking-tight">
            Ready to ship faster?
          </h2>
          <p className="mt-3 text-base text-primary-fg/80 leading-relaxed">
            Join 5 000+ teams. Free forever on Starter — no credit card required.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={`${BASE}/pricing`}
              className="inline-flex items-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-primary hover:bg-primary-subtle transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              See pricing
            </a>
            <a
              href={`${BASE}/about`}
              className="inline-flex items-center rounded-xl border border-white/40 px-6 py-3 text-sm font-semibold text-primary-fg hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Meet the team
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
