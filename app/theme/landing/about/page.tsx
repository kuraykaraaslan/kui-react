import type { Metadata } from 'next';
import { Breadcrumb } from '@/modules/ui/Breadcrumb';
import { TeamMemberCard } from '@/modules/domains/landing/team/TeamMemberCard';
import { StatsBar } from '@/modules/domains/landing/stat/StatsBar';
import { PartnerLogosStrip } from '@/modules/domains/landing/partner/PartnerLogosStrip';
import { TEAM, STATS, PARTNERS } from '../landing.data';
import { buildPageTitle, THEME_TITLES } from '@/libs/config/showcase.config';

export const metadata: Metadata = {
  title: buildPageTitle('About', THEME_TITLES.landing),
};

const BASE = '/theme/landing';

const COMPANY_VALUES = [
  {
    id: 'v1',
    title: 'Developer first',
    description: 'Every decision starts with the question: does this make a developer\'s day better?',
  },
  {
    id: 'v2',
    title: 'Radical transparency',
    description: 'Uptime, incidents, and pricing — no hidden numbers, no surprise changes.',
  },
  {
    id: 'v3',
    title: 'Default to calm',
    description: 'We ship deliberately. No 3 AM deploys, no panic patches, no hero culture.',
  },
];

export default function AboutPage() {
  return (
    <div className="bg-surface-base text-text-primary">

      {/* Page header */}
      <div className="relative overflow-hidden border-b border-border bg-surface-raised">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(50%_60%_at_80%_0%,_var(--primary-subtle),_transparent_70%)]" />
        </div>
        <div className="mx-auto max-w-6xl px-6 py-12">
          <Breadcrumb
            items={[
              { label: 'Velox', href: BASE },
              { label: 'About' },
            ]}
            className="mb-4"
          />
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
              We are building the deploy tool we always wished existed
            </h1>
            <p className="mt-4 text-base text-text-secondary leading-relaxed">
              Velox started in 2024 when four engineers — tired of stitching together five separate
              tools just to ship a feature — decided to build the one platform that covered the whole
              journey from commit to production.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <StatsBar stats={STATS} />

      {/* Values */}
      <section className="py-16 lg:py-20 bg-surface-base">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-xl mb-10">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-3">
              What we believe
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
              Our values
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {COMPANY_VALUES.map((v) => (
              <div
                key={v.id}
                className="rounded-2xl border border-border bg-surface-raised p-6"
              >
                <h3 className="text-sm font-semibold text-text-primary mb-2">{v.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 lg:py-20 bg-surface-raised">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-3">
              The team
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
              Meet the builders
            </h2>
            <p className="mt-3 text-base text-text-secondary leading-relaxed">
              We have shipped developer tools at Vercel, Stripe, Shopify, and Linear.
              Now we are building the one we always wished existed.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map((member) => (
              <TeamMemberCard key={member.memberId} member={member} />
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <PartnerLogosStrip
        label="Our technology partners"
        partners={PARTNERS}
        className="border-y border-border py-12"
      />

      {/* CTA */}
      <section className="bg-primary py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold text-primary-fg tracking-tight">
            Come build with us
          </h2>
          <p className="mt-3 text-base text-primary-fg/80">
            We are hiring across engineering, design, and growth. Remote-first.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#"
              className="inline-flex items-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-primary hover:bg-primary-subtle transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              View open roles
            </a>
            <a
              href={`${BASE}/pricing`}
              className="inline-flex items-center rounded-xl border border-white/40 px-6 py-3 text-sm font-semibold text-primary-fg hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Start using Velox
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
