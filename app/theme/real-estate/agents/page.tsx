import type { Metadata } from 'next';
import { buildPageTitle, THEME_TITLES } from '@/libs/config/showcase.config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faStar,
  faBuilding,
  faPhone,
  faEnvelope,
  faMedal,
  faLocationDot,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';
import { Avatar } from '@/modules/ui/Avatar';
import { Badge } from '@/modules/ui/Badge';
import { AGENTS, PROPERTIES } from '../real-estate.data';

export const metadata: Metadata = {
  title: buildPageTitle('Agents', THEME_TITLES['real-estate']),
};

const STATS = [
  { label: 'Expert Agents',   value: String(AGENTS.length),       icon: faUsers    },
  { label: 'Total Listings',  value: String(PROPERTIES.length),   icon: faBuilding },
  { label: 'Cities Covered',  value: '5',                         icon: faLocationDot },
  { label: 'Avg. Rating',     value: '4.8',                       icon: faStar     },
];

function StarRating({ rating, count }: { rating: number; count?: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < Math.floor(rating);
          const half = !filled && i < rating;
          return (
            <FontAwesomeIcon
              key={i}
              icon={faStar}
              className={filled || half ? 'w-3.5 h-3.5 text-warning' : 'w-3.5 h-3.5 text-border'}
              aria-hidden="true"
            />
          );
        })}
      </div>
      <span className="text-xs font-semibold text-text-primary">{rating.toFixed(1)}</span>
      {count != null && <span className="text-xs text-text-secondary">({count} reviews)</span>}
    </div>
  );
}

export default function AgentsPage() {
  const agentsWithCounts = AGENTS.map((agent) => ({
    ...agent,
    listingCount: PROPERTIES.filter((p) => p.agentId === agent.agentId).length,
  }));

  const topAgent = [...agentsWithCounts].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))[0];

  return (
    <div className="bg-surface-base">

      {/* ── Hero ── */}
      <section className="border-b border-border bg-surface-raised">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="text-center space-y-3 mb-10">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-primary-subtle text-primary mb-2">
              <FontAwesomeIcon icon={faUsers} className="w-7 h-7" aria-hidden="true" />
            </div>
            <h1 className="text-3xl font-bold text-text-primary">Our Expert Agents</h1>
            <p className="text-text-secondary max-w-md mx-auto text-sm leading-relaxed">
              Our certified agents are local specialists with proven track records. Get in touch with any of them directly.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {STATS.map((s) => (
              <div key={s.label} className="text-center rounded-xl border border-border bg-surface-base p-4 space-y-1">
                <FontAwesomeIcon icon={s.icon} className="w-5 h-5 text-primary" aria-hidden="true" />
                <p className="text-2xl font-bold text-text-primary">{s.value}</p>
                <p className="text-xs text-text-secondary">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Top agent spotlight ── */}
      {topAgent && (
        <section className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex items-center gap-2 mb-4">
            <FontAwesomeIcon icon={faMedal} className="w-5 h-5 text-warning" aria-hidden="true" />
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">Top Rated Agent</h2>
          </div>
          <div className="rounded-2xl border border-border bg-surface-raised p-6 flex flex-col sm:flex-row gap-6">
            <Avatar
              src={topAgent.avatarUrl}
              name={topAgent.name}
              size="xl"
              className="shrink-0 mx-auto sm:mx-0"
            />
            <div className="flex-1 space-y-3">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-xl font-bold text-text-primary">{topAgent.name}</h3>
                  <Badge variant="warning" size="sm">
                    <FontAwesomeIcon icon={faMedal} className="w-3 h-3 mr-1" aria-hidden="true" />
                    Top Rated
                  </Badge>
                </div>
                <p className="text-sm text-text-secondary mt-0.5">{topAgent.specialization} · {topAgent.yearsExp} years experience</p>
              </div>
              {topAgent.rating != null && (
                <StarRating rating={topAgent.rating} count={topAgent.reviewCount} />
              )}
              {topAgent.bio && (
                <p className="text-sm text-text-secondary leading-relaxed max-w-2xl">{topAgent.bio}</p>
              )}
              <div className="flex flex-wrap gap-3 pt-1">
                <a
                  href={`tel:${topAgent.phone}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-fg text-sm font-medium hover:bg-primary-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                >
                  <FontAwesomeIcon icon={faPhone} className="w-3.5 h-3.5" aria-hidden="true" />
                  {topAgent.phone}
                </a>
                <a
                  href={`mailto:${topAgent.email}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-text-secondary text-sm font-medium hover:text-text-primary hover:border-border-focus transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                >
                  <FontAwesomeIcon icon={faEnvelope} className="w-3.5 h-3.5" aria-hidden="true" />
                  {topAgent.email}
                </a>
              </div>
            </div>
            <div className="shrink-0 text-center sm:text-right space-y-2">
              <div className="rounded-xl border border-border bg-surface-base px-4 py-3">
                <p className="text-2xl font-bold text-primary">{topAgent.listingCount}</p>
                <p className="text-xs text-text-secondary">Active listings</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── All agents grid ── */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <h2 className="text-xl font-bold text-text-primary mb-6">All Agents</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {agentsWithCounts.map((agent) => (
            <div
              key={agent.agentId}
              className="rounded-2xl border border-border bg-surface-raised overflow-hidden hover:shadow-md hover:border-border-focus transition-all"
            >
              {/* Header band — click navigates to profile */}
              <a
                href={`/theme/real-estate/agents/${agent.agentId}`}
                className="block h-20 bg-gradient-to-r from-primary-subtle to-primary/20 focus-visible:outline-none focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-border-focus"
                aria-label={`View ${agent.name}'s profile`}
              />

              <div className="px-5 pb-5 -mt-10 space-y-4">
                {/* Avatar + badges */}
                <div className="flex items-end justify-between">
                  <Avatar
                    src={agent.avatarUrl}
                    name={agent.name}
                    size="xl"
                    className="ring-4 ring-surface-raised !h-20 !w-20"
                  />
                  {agent.rating != null && agent.rating >= 4.8 && (
                    <Badge variant="warning" size="sm" className="mb-1">
                      <FontAwesomeIcon icon={faMedal} className="w-3 h-3 mr-1" aria-hidden="true" />
                      Top Rated
                    </Badge>
                  )}
                </div>

                {/* Name & role */}
                <div>
                  <h3 className="text-base font-bold text-text-primary">{agent.name}</h3>
                  <p className="text-xs text-text-secondary">{agent.specialization ?? 'Real Estate Agent'}</p>
                  {agent.yearsExp && (
                    <p className="text-xs text-text-disabled mt-0.5">{agent.yearsExp} years experience</p>
                  )}
                </div>

                {/* Rating */}
                {agent.rating != null && (
                  <StarRating rating={agent.rating} count={agent.reviewCount} />
                )}

                {/* Bio */}
                {agent.bio && (
                  <p className="text-sm text-text-secondary leading-relaxed line-clamp-3">{agent.bio}</p>
                )}

                {/* Stats row */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg border border-border bg-surface-base px-3 py-2 text-center">
                    <p className="text-base font-bold text-primary">{agent.listingCount}</p>
                    <p className="text-xs text-text-secondary">Listings</p>
                  </div>
                  <div className="rounded-lg border border-border bg-surface-base px-3 py-2 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <FontAwesomeIcon icon={faCheckCircle} className="w-3.5 h-3.5 text-success" aria-hidden="true" />
                      <p className="text-xs font-medium text-text-primary">Verified</p>
                    </div>
                    <p className="text-xs text-text-secondary">Agent</p>
                  </div>
                </div>

                {/* Contact */}
                <div className="flex flex-col gap-1.5 text-sm text-text-secondary pt-1 border-t border-border">
                  {agent.phone && (
                    <a
                      href={`tel:${agent.phone}`}
                      className="flex items-center gap-2 hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus rounded"
                    >
                      <FontAwesomeIcon icon={faPhone} className="w-3.5 h-3.5 text-primary shrink-0" aria-hidden="true" />
                      <span>{agent.phone}</span>
                    </a>
                  )}
                  <a
                    href={`mailto:${agent.email}`}
                    className="flex items-center gap-2 hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus rounded"
                  >
                    <FontAwesomeIcon icon={faEnvelope} className="w-3.5 h-3.5 text-primary shrink-0" aria-hidden="true" />
                    <span className="truncate">{agent.email}</span>
                  </a>
                </div>

                <div className="flex gap-2">
                  <a
                    href={`/theme/real-estate/agents/${agent.agentId}`}
                    className="flex-1 inline-flex items-center justify-center rounded-lg border border-border bg-surface-overlay text-sm font-medium text-text-secondary hover:text-text-primary hover:border-border-focus transition-colors py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                  >
                    View Profile
                  </a>
                  <a
                    href={`mailto:${agent.email}`}
                    className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-fg text-sm font-medium px-3 py-2 hover:bg-primary-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                  >
                    Contact
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Become an agent CTA ── */}
      <section className="border-t border-border bg-surface-raised">
        <div className="mx-auto max-w-7xl px-6 py-12 text-center space-y-4">
          <h2 className="text-xl font-bold text-text-primary">Are you a real estate professional?</h2>
          <p className="text-sm text-text-secondary max-w-md mx-auto leading-relaxed">
            Join our network of certified agents and reach thousands of buyers and renters every month.
          </p>
          <a
            href="/theme/real-estate/contact"
            className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-fg text-sm font-medium px-5 py-2.5 hover:bg-primary-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
          >
            Apply to Join EstateView
          </a>
        </div>
      </section>
    </div>
  );
}
