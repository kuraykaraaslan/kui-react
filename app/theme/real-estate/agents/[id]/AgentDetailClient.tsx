'use client';
import Link from 'next/link';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar,
  faPhone,
  faEnvelope,
  faBuilding,
  faMedal,
  faCheckCircle,
  faArrowLeft,
  faPaperPlane,
  faXmark,
  faLocationDot,
} from '@fortawesome/free-solid-svg-icons';
import { Avatar } from '@/modules/ui/Avatar';
import { Badge } from '@/modules/ui/Badge';
import { Button } from '@/modules/ui/Button';
import { PropertyCard } from '@/modules/domains/real-estate/property/PropertyCard';
import { AGENTS, PROPERTIES } from '../../real-estate.data';

function StarRow({ rating, count }: { rating: number; count?: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <FontAwesomeIcon
          key={i}
          icon={faStar}
          className={i < Math.floor(rating) ? 'w-4 h-4 text-warning' : 'w-4 h-4 text-border'}
          aria-hidden="true"
        />
      ))}
      <span className="text-sm font-semibold text-text-primary ml-1">{rating.toFixed(1)}</span>
      {count != null && (
        <span className="text-sm text-text-secondary">({count} reviews)</span>
      )}
    </div>
  );
}

export function AgentDetailClient({
  agent,
  listings,
}: {
  agent: NonNullable<ReturnType<typeof AGENTS.find>>;
  listings: typeof PROPERTIES;
}) {
  const [contactOpen, setContactOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(
    `Hi ${agent.name}, I'd like to discuss a property with you.`
  );
  const [sent, setSent] = useState(false);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="bg-surface-base text-text-primary">

      {/* ── Back nav ── */}
      <div className="border-b border-border bg-surface-raised">
        <div className="mx-auto max-w-7xl px-6 py-3">
          <Link
            href="/theme/real-estate/agents"
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus rounded"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="w-3.5 h-3.5" aria-hidden="true" />
            Back to Agents
          </Link>
        </div>
      </div>

      {/* ── Profile hero ── */}
      <section className="border-b border-border">
        <div className="h-44 bg-gradient-to-r from-primary/20 via-primary-subtle to-secondary/10" />
        <div className="mx-auto max-w-7xl px-6 pb-8 -mt-16">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end">
            <Avatar
              src={agent.avatarUrl}
              name={agent.name}
              size="xl"
              className="ring-4 ring-surface-base !h-24 !w-24 shrink-0"
            />
            <div className="flex-1 space-y-2 sm:pb-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-text-primary">{agent.name}</h1>
                {agent.rating != null && agent.rating >= 4.8 && (
                  <Badge variant="warning" size="sm">
                    <FontAwesomeIcon icon={faMedal} className="w-3 h-3 mr-1" aria-hidden="true" />
                    Top Rated
                  </Badge>
                )}
              </div>
              <p className="text-sm text-text-secondary">
                {agent.specialization ?? 'Real Estate Agent'}
                {agent.yearsExp ? ` · ${agent.yearsExp} years experience` : ''}
              </p>
              {agent.rating != null && (
                <StarRow rating={agent.rating} count={agent.reviewCount} />
              )}
            </div>
            <div className="flex gap-2 sm:pb-2 shrink-0">
              {agent.phone && (
                <a
                  href={`tel:${agent.phone}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-surface-raised text-sm font-medium text-text-secondary hover:text-text-primary hover:border-border-focus transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                >
                  <FontAwesomeIcon icon={faPhone} className="w-3.5 h-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline">{agent.phone}</span>
                  <span className="sm:hidden">Call</span>
                </a>
              )}
              <Button variant="primary" size="md" onClick={() => setContactOpen(true)}>
                <FontAwesomeIcon icon={faPaperPlane} className="w-3.5 h-3.5 mr-2" aria-hidden="true" />
                Message
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Body ── */}
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Main: bio + listings */}
          <div className="lg:col-span-2 space-y-8">
            {agent.bio && (
              <div className="rounded-2xl border border-border bg-surface-raised p-6 space-y-3">
                <h2 className="text-base font-semibold text-text-primary">About</h2>
                <p className="text-sm text-text-secondary leading-relaxed">{agent.bio}</p>
              </div>
            )}

            <div>
              <h2 className="text-xl font-bold text-text-primary mb-5">
                Active Listings
                <span className="ml-2 text-sm font-normal text-text-secondary">({listings.length})</span>
              </h2>
              {listings.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {listings.map((p) => (
                    <PropertyCard
                      key={p.propertyId}
                      property={p}
                      href={`/theme/real-estate/properties/${p.slug}`}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-border bg-surface-raised py-12 text-center">
                  <FontAwesomeIcon
                    icon={faBuilding}
                    className="w-8 h-8 text-text-disabled mx-auto mb-3"
                    aria-hidden="true"
                  />
                  <p className="text-text-secondary text-sm">No active listings at this time.</p>
                </div>
              )}
            </div>

            {/* Coverage areas */}
            <div className="rounded-2xl border border-border bg-surface-raised p-6 space-y-4">
              <h2 className="text-base font-semibold text-text-primary">Coverage Areas</h2>
              <div className="flex flex-wrap gap-2">
                {Array.from(new Set(listings.map((p) => p.city))).map((city) => (
                  <span
                    key={city}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-surface-base text-xs font-medium text-text-secondary"
                  >
                    <FontAwesomeIcon icon={faLocationDot} className="w-3 h-3 text-primary" aria-hidden="true" />
                    {city}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Stats */}
            <div className="rounded-2xl border border-border bg-surface-raised p-5 space-y-4">
              <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">Agent Stats</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border bg-surface-base p-3 text-center">
                  <p className="text-xl font-bold text-primary">{listings.length}</p>
                  <p className="text-xs text-text-secondary mt-0.5">Active Listings</p>
                </div>
                {agent.yearsExp && (
                  <div className="rounded-xl border border-border bg-surface-base p-3 text-center">
                    <p className="text-xl font-bold text-primary">{agent.yearsExp}</p>
                    <p className="text-xs text-text-secondary mt-0.5">Years Exp.</p>
                  </div>
                )}
                {agent.rating != null && (
                  <div className="rounded-xl border border-border bg-surface-base p-3 text-center">
                    <p className="text-xl font-bold text-primary">{agent.rating.toFixed(1)}</p>
                    <p className="text-xs text-text-secondary mt-0.5">Avg Rating</p>
                  </div>
                )}
                {agent.reviewCount != null && (
                  <div className="rounded-xl border border-border bg-surface-base p-3 text-center">
                    <p className="text-xl font-bold text-primary">{agent.reviewCount}</p>
                    <p className="text-xs text-text-secondary mt-0.5">Reviews</p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 pt-1 border-t border-border">
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-success" aria-hidden="true" />
                <span className="text-xs text-text-secondary">Verified EstateView Agent</span>
              </div>
            </div>

            {/* Contact */}
            <div className="rounded-2xl border border-border bg-surface-raised p-5 space-y-3 sticky top-20">
              <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">Contact</h2>
              {agent.phone && (
                <a
                  href={`tel:${agent.phone}`}
                  className="flex items-center gap-3 text-sm text-text-secondary hover:text-text-primary transition-colors"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-subtle text-primary shrink-0">
                    <FontAwesomeIcon icon={faPhone} className="w-3.5 h-3.5" aria-hidden="true" />
                  </div>
                  {agent.phone}
                </a>
              )}
              <a
                href={`mailto:${agent.email}`}
                className="flex items-center gap-3 text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-subtle text-primary shrink-0">
                  <FontAwesomeIcon icon={faEnvelope} className="w-3.5 h-3.5" aria-hidden="true" />
                </div>
                <span className="truncate">{agent.email}</span>
              </a>
              <Button variant="primary" fullWidth size="md" onClick={() => setContactOpen(true)}>
                <FontAwesomeIcon icon={faPaperPlane} className="w-4 h-4 mr-2" aria-hidden="true" />
                Send Message
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Contact modal ── */}
      {contactOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`Contact ${agent.name}`}
        >
          <div className="w-full max-w-md rounded-2xl bg-surface-base border border-border shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-text-primary">Contact {agent.name}</h2>
              <button
                onClick={() => { setContactOpen(false); setSent(false); }}
                aria-label="Close contact form"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary hover:bg-surface-overlay transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
              >
                <FontAwesomeIcon icon={faXmark} className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {sent ? (
              <div className="text-center py-6 space-y-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success-subtle text-success mx-auto">
                  <FontAwesomeIcon icon={faCheckCircle} className="w-7 h-7" aria-hidden="true" />
                </div>
                <p className="text-base font-semibold text-text-primary">Message Sent!</p>
                <p className="text-sm text-text-secondary">
                  {agent.name} will get back to you within 24 hours.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { setContactOpen(false); setSent(false); }}
                >
                  Close
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSend} className="space-y-4">
                <div>
                  <label htmlFor="a-name" className="block text-xs font-medium text-text-secondary mb-1">
                    Your Name
                  </label>
                  <input
                    id="a-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name"
                    className="w-full px-3 py-2.5 rounded-lg border border-border bg-surface-raised text-sm focus:outline-none focus:ring-2 focus:ring-border-focus"
                  />
                </div>
                <div>
                  <label htmlFor="a-email" className="block text-xs font-medium text-text-secondary mb-1">
                    Email
                  </label>
                  <input
                    id="a-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-3 py-2.5 rounded-lg border border-border bg-surface-raised text-sm focus:outline-none focus:ring-2 focus:ring-border-focus"
                  />
                </div>
                <div>
                  <label htmlFor="a-msg" className="block text-xs font-medium text-text-secondary mb-1">
                    Message
                  </label>
                  <textarea
                    id="a-msg"
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-border bg-surface-raised text-sm resize-none focus:outline-none focus:ring-2 focus:ring-border-focus"
                  />
                </div>
                <Button variant="primary" fullWidth type="submit">
                  <FontAwesomeIcon icon={faPaperPlane} className="w-4 h-4 mr-2" aria-hidden="true" />
                  Send Message
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
