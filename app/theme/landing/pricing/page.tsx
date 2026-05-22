import type { Metadata } from 'next';
import { Breadcrumb } from '@/modules/ui/Breadcrumb';
import { PricingGrid } from '@/modules/domains/landing/pricing/PricingGrid';
import { FaqAccordion } from '@/modules/domains/landing/faq/FaqAccordion';
import { StatsBar } from '@/modules/domains/landing/stat/StatsBar';
import { ALL_PLANS, FAQ_ITEMS, STATS } from '../landing.data';
import { buildPageTitle, THEME_TITLES } from '@/libs/config/showcase.config';

export const metadata: Metadata = {
  title: buildPageTitle('Pricing', THEME_TITLES.landing),
};

const BASE = '/theme/landing';

export default function PricingPage() {
  return (
    <div className="bg-surface-base text-text-primary">

      {/* Page header */}
      <div className="border-b border-border bg-surface-raised">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <Breadcrumb
            items={[
              { label: 'Velox', href: BASE },
              { label: 'Pricing' },
            ]}
            className="mb-4"
          />
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
            Simple, transparent pricing
          </h1>
          <p className="mt-3 max-w-xl text-base text-text-secondary leading-relaxed">
            Start free. Upgrade only when you need to. No hidden fees, no surprise overages.
          </p>
        </div>
      </div>

      {/* Pricing grid with interval toggle */}
      <PricingGrid
        eyebrow="Plans"
        title="Choose what fits your team"
        subtitle="Switch between monthly and yearly billing at any time."
        plans={ALL_PLANS}
        showIntervalToggle
        className="bg-surface-base"
      />

      {/* Social proof */}
      <StatsBar stats={STATS} />

      {/* FAQ */}
      <FaqAccordion
        eyebrow="FAQ"
        title="Pricing questions answered"
        subtitle="Still unsure? Email us at hello@velox.dev — we reply within one business day."
        items={FAQ_ITEMS}
        className="bg-surface-base"
      />

      {/* CTA */}
      <section className="bg-primary py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold text-primary-fg tracking-tight">
            Start building today
          </h2>
          <p className="mt-3 text-base text-primary-fg/80">
            Starter is free forever. No credit card needed.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#"
              className="inline-flex items-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-primary hover:bg-primary-subtle transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Get started free
            </a>
            <a
              href={`${BASE}/features`}
              className="inline-flex items-center rounded-xl border border-white/40 px-6 py-3 text-sm font-semibold text-primary-fg hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Compare features
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
