import type { Metadata } from 'next';
import { buildPageTitle, THEME_TITLES } from '@/libs/config/showcase.config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBuilding,
  faHandshake,
  faUsers,
  faStar,
  faCheckCircle,
  faArrowRight,
  faLightbulb,
  faShieldHalved,
  faHeart,
  faChartLine,
} from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/modules/ui/Button';
import { AGENTS } from '../real-estate.data';

export const metadata: Metadata = {
  title: buildPageTitle('About', THEME_TITLES['real-estate']),
};

const MILESTONES = [
  { year: '2012', title: 'EstateView Founded', desc: 'Started with a small team of 5 agents in Istanbul with a simple goal: honest, transparent property search.' },
  { year: '2015', title: 'Expanded to 3 Cities', desc: 'Opened dedicated offices in Ankara and Izmir to serve the whole western Turkey corridor.' },
  { year: '2018', title: '1,000th Listing Milestone', desc: 'Reached our 1,000th verified listing — a milestone that proved our quality-first model worked.' },
  { year: '2021', title: 'Digital Transformation', desc: 'Launched our AI-powered search, virtual tours, and the EstateView mobile app.' },
  { year: '2024', title: '120+ Agent Network', desc: 'Now serving all major Turkish cities with a network of 120+ certified, rated agents.' },
];

const VALUES = [
  { icon: faShieldHalved, title: 'Transparency', desc: 'We verify every listing and disclose all material facts before anything goes live.' },
  { icon: faHeart, title: 'Client First', desc: 'Your goals are our goals. We earn trust through results, not just transactions.' },
  { icon: faLightbulb, title: 'Innovation', desc: 'We invest in technology to make property search smarter, faster, and fairer.' },
  { icon: faHandshake, title: 'Integrity', desc: 'Fair dealing, honest advice, and zero hidden fees — always.' },
];

const STATS = [
  { label: 'Years of Experience', value: '12+' },
  { label: 'Properties Sold', value: '9,400+' },
  { label: 'Happy Clients', value: '6,200+' },
  { label: 'Expert Agents', value: '120+' },
];

export default function AboutPage() {
  return (
    <div className="bg-surface-base text-text-primary">

      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden border-b border-border"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6 py-24 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20 text-primary mb-6 mx-auto">
            <FontAwesomeIcon icon={faBuilding} className="w-8 h-8" aria-hidden="true" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-4">
            About <span className="text-primary">EstateView</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
            Since 2012, we&apos;ve been Turkey&apos;s most trusted property platform — connecting buyers,
            sellers, and renters with verified listings and expert agents across the country.
          </p>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="border-b border-border bg-surface-raised">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-border">
            {STATS.map((s) => (
              <div key={s.label} className="text-center px-4 py-2">
                <p className="text-3xl font-bold text-primary">{s.value}</p>
                <p className="text-sm text-text-secondary mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-widest">
              <FontAwesomeIcon icon={faLightbulb} className="w-3.5 h-3.5" aria-hidden="true" />
              Our Mission
            </div>
            <h2 className="text-3xl font-bold text-text-primary leading-snug">
              Making property search simpler, safer, and more transparent
            </h2>
            <p className="text-text-secondary leading-relaxed">
              The Turkish real estate market is complex and fast-moving. EstateView was built to cut
              through the noise — bringing all verified listings to one platform, pairing them with
              knowledgeable local agents, and giving buyers and renters the data they need to make
              confident decisions.
            </p>
            <p className="text-text-secondary leading-relaxed">
              Whether you&apos;re a first-time buyer, a seasoned investor, or an expat looking for a
              short-term rental, our platform is built to serve you — in your language, at your pace,
              with your interests front and centre.
            </p>
            <a
              href="/theme/real-estate/properties"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              Browse properties
              <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>
          <div className="relative">
            <img
              src="https://picsum.photos/seed/about-office/700/480"
              alt="EstateView office"
              className="rounded-2xl w-full object-cover h-80 shadow-lg"
            />
            <div className="absolute -bottom-5 -left-5 rounded-xl border border-border bg-surface-base shadow-md px-4 py-3 hidden sm:block">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success-subtle text-success">
                  <FontAwesomeIcon icon={faCheckCircle} className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary">Verified Platform</p>
                  <p className="text-xs text-text-secondary">Every listing checked by our team</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="bg-surface-raised border-y border-border">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-text-primary">What We Stand For</h2>
            <p className="text-text-secondary mt-2 text-sm">The values that guide every decision we make</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-xl border border-border bg-surface-base p-6 space-y-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-subtle text-primary">
                  <FontAwesomeIcon icon={v.icon} className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="text-base font-semibold text-text-primary">{v.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Milestones timeline ── */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-text-primary">Our Journey</h2>
          <p className="text-text-secondary mt-2 text-sm">From a small Istanbul office to a nationwide platform</p>
        </div>
        <div className="relative">
          <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-0.5 bg-border hidden sm:block" />
          <div className="space-y-8">
            {MILESTONES.map((m, i) => (
              <div
                key={m.year}
                className={`flex gap-6 sm:gap-0 items-start ${
                  i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'
                }`}
              >
                <div
                  className={`flex-1 ${
                    i % 2 === 0 ? 'sm:text-right sm:pr-10' : 'sm:text-left sm:pl-10'
                  }`}
                >
                  <div className="inline-block rounded-xl border border-border bg-surface-raised p-5 max-w-sm text-left">
                    <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">{m.year}</p>
                    <h3 className="text-base font-semibold text-text-primary">{m.title}</h3>
                    <p className="text-sm text-text-secondary mt-1 leading-relaxed">{m.desc}</p>
                  </div>
                </div>
                <div className="shrink-0 relative z-10 mt-5">
                  <div className="h-4 w-4 rounded-full bg-primary ring-4 ring-surface-base" />
                </div>
                <div className="flex-1 hidden sm:block" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team preview ── */}
      <section className="bg-surface-raised border-y border-border">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-text-primary">Meet the Team</h2>
              <p className="text-text-secondary mt-1 text-sm">Our certified agents are the backbone of EstateView</p>
            </div>
            <a
              href="/theme/real-estate/agents"
              className="flex items-center gap-1.5 text-sm text-primary font-medium hover:underline shrink-0"
            >
              All agents
              <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {AGENTS.map((agent) => (
              <a
                key={agent.agentId}
                href={`/theme/real-estate/agents/${agent.agentId}`}
                className="rounded-2xl border border-border bg-surface-base overflow-hidden hover:shadow-md hover:border-border-focus transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
              >
                <div className="h-16 bg-gradient-to-r from-primary-subtle to-primary/10" />
                <div className="px-5 pb-5 -mt-8">
                  <img
                    src={agent.avatarUrl}
                    alt={agent.name}
                    className="h-16 w-16 rounded-full ring-4 ring-surface-base object-cover"
                  />
                  <h3 className="text-base font-bold text-text-primary mt-3">{agent.name}</h3>
                  <p className="text-xs text-text-secondary">{agent.specialization}</p>
                  {agent.rating && (
                    <div className="flex items-center gap-1 mt-2">
                      <FontAwesomeIcon icon={faStar} className="w-3.5 h-3.5 text-warning" aria-hidden="true" />
                      <span className="text-xs font-semibold text-text-primary">{agent.rating}</span>
                      <span className="text-xs text-text-disabled">({agent.reviewCount} reviews)</span>
                    </div>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="mx-auto max-w-7xl px-6 py-16 text-center">
        <h2 className="text-2xl font-bold text-text-primary mb-3">Ready to find your next property?</h2>
        <p className="text-text-secondary text-sm mb-6 max-w-md mx-auto">
          Join thousands of satisfied clients who found their perfect home, office, or investment through EstateView.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="/theme/real-estate/properties">
            <Button variant="primary" size="md">
              <FontAwesomeIcon icon={faBuilding} className="w-4 h-4 mr-2" aria-hidden="true" />
              Browse Properties
            </Button>
          </a>
          <a href="/theme/real-estate/contact">
            <Button variant="outline" size="md">
              <FontAwesomeIcon icon={faUsers} className="w-4 h-4 mr-2" aria-hidden="true" />
              Get in Touch
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
}
