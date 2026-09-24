'use client';
import Link from 'next/link';
import { useState } from 'react';
import { PropertyCard } from '@/modules/domains/real-estate/property/PropertyCard';
import { AgentCard } from '@/modules/domains/real-estate/agent/AgentCard';
import { PropertyStatusBadge } from '@/modules/domains/real-estate/property/PropertyStatusBadge';
import { PropertyTypeBadge } from '@/modules/domains/real-estate/property/PropertyTypeBadge';
import { ListingTypeBadge } from '@/modules/domains/real-estate/listing/ListingTypeBadge';
import { MortgageCalculator } from '@/modules/domains/real-estate/mortgage/MortgageCalculator';
import { Button } from '@/modules/ui/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBed,
  faBath,
  faRulerCombined,
  faLocationDot,
  faArrowLeft,
  faShare,
  faHeart,
  faCheckCircle,
  faCalendarDays,
  faLayerGroup,
  faCar,
  faChevronLeft,
  faChevronRight,
  faPhone,
  faPaperPlane,
  faClock,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { PROPERTIES, AGENTS } from '../../real-estate.data';
import { cn } from '@/libs/utils/cn';

function formatPrice(price: number, currency: string): string {
  if (currency === 'TRY') {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(price);
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(price);
}

export function PropertyDetailClient({
  property,
  agent,
  similar,
  images,
}: {
  property: NonNullable<ReturnType<typeof PROPERTIES.find>>;
  agent: ReturnType<typeof AGENTS.find>;
  similar: typeof PROPERTIES;
  images: string[];
}) {
  const [activeImg, setActiveImg] = useState(0);
  const [saved, setSaved] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(`Hi, I'm interested in "${property.title}". Please get in touch.`);
  const [sent, setSent] = useState(false);

  function prevImg() { setActiveImg((i) => (i - 1 + images.length) % images.length); }
  function nextImg() { setActiveImg((i) => (i + 1) % images.length); }

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="bg-surface-base">
      {/* ── Gallery ── */}
      <div className="relative bg-black select-none">
        <div className="relative mx-auto max-w-7xl overflow-hidden" style={{ height: '480px' }}>
          {images.length > 0 ? (
            <>
              <img
                src={images[activeImg]}
                alt={`${property.title} — image ${activeImg + 1}`}
                className="h-full w-full object-cover transition-opacity duration-300"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

              {/* Nav arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImg}
                    aria-label="Previous image"
                    className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <button
                    onClick={nextImg}
                    aria-label="Next image"
                    className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4" aria-hidden="true" />
                  </button>
                </>
              )}

              {/* Dot indicators */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      aria-label={`Image ${i + 1}`}
                      className={cn(
                        'rounded-full transition-all focus-visible:outline-none',
                        i === activeImg ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/50 hover:bg-white/80'
                      )}
                    />
                  ))}
                </div>
              )}

              {/* Image counter */}
              <div className="absolute bottom-4 right-4 px-2.5 py-1 rounded-lg bg-black/60 text-white text-xs font-medium">
                {activeImg + 1} / {images.length}
              </div>
            </>
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-primary-subtle via-surface-overlay to-surface-sunken flex items-center justify-center">
              <FontAwesomeIcon icon={faLocationDot} className="w-20 h-20 text-text-disabled" aria-hidden="true" />
            </div>
          )}

          {/* Top-left: back link */}
          <div className="absolute top-4 left-4">
            <Link
              href="/theme/real-estate/properties"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/50 text-white text-sm hover:bg-black/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="w-3.5 h-3.5" aria-hidden="true" />
              Back
            </Link>
          </div>

          {/* Top-right: actions */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={() => setSaved(!saved)}
              aria-label={saved ? 'Remove from saved' : 'Save property'}
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white',
                saved ? 'bg-error text-white' : 'bg-black/50 text-white hover:bg-black/70'
              )}
            >
              <FontAwesomeIcon icon={faHeart} className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              aria-label="Share property"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <FontAwesomeIcon icon={faShare} className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div className="flex gap-2 px-4 py-2 overflow-x-auto max-w-7xl mx-auto bg-black">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                aria-label={`Go to image ${i + 1}`}
                className={cn(
                  'shrink-0 h-14 w-20 rounded overflow-hidden border-2 transition-all focus-visible:outline-none',
                  i === activeImg ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-90'
                )}
              >
                <img src={img} alt="" aria-hidden="true" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-3">

          {/* ── Main column ── */}
          <div className="lg:col-span-2 space-y-7">

            {/* Title block */}
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <PropertyTypeBadge type={property.type} />
                <ListingTypeBadge type={property.listingType} />
                <PropertyStatusBadge status={property.status} />
                {property.daysOnMarket != null && property.daysOnMarket <= 7 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-warning-subtle text-warning text-xs font-medium">
                    <FontAwesomeIcon icon={faClock} className="w-3 h-3" aria-hidden="true" />
                    New listing
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-text-primary leading-snug">{property.title}</h1>
              <p className="flex items-center gap-1.5 text-sm text-text-secondary">
                <FontAwesomeIcon icon={faLocationDot} className="w-4 h-4 text-primary" aria-hidden="true" />
                {property.district ? `${property.district}, ` : ''}{property.city}
              </p>
            </div>

            {/* Specs grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {property.bedrooms != null && (
                <div className="rounded-xl border border-border bg-surface-raised p-4 flex flex-col items-center gap-1 text-center">
                  <FontAwesomeIcon icon={faBed} className="w-5 h-5 text-primary" aria-hidden="true" />
                  <p className="text-lg font-bold text-text-primary">{property.bedrooms}</p>
                  <p className="text-xs text-text-secondary">Bedrooms</p>
                </div>
              )}
              {property.bathrooms != null && (
                <div className="rounded-xl border border-border bg-surface-raised p-4 flex flex-col items-center gap-1 text-center">
                  <FontAwesomeIcon icon={faBath} className="w-5 h-5 text-primary" aria-hidden="true" />
                  <p className="text-lg font-bold text-text-primary">{property.bathrooms}</p>
                  <p className="text-xs text-text-secondary">Bathrooms</p>
                </div>
              )}
              {property.area != null && (
                <div className="rounded-xl border border-border bg-surface-raised p-4 flex flex-col items-center gap-1 text-center">
                  <FontAwesomeIcon icon={faRulerCombined} className="w-5 h-5 text-primary" aria-hidden="true" />
                  <p className="text-lg font-bold text-text-primary">{property.area}</p>
                  <p className="text-xs text-text-secondary">m² Area</p>
                </div>
              )}
              {property.yearBuilt && (
                <div className="rounded-xl border border-border bg-surface-raised p-4 flex flex-col items-center gap-1 text-center">
                  <FontAwesomeIcon icon={faCalendarDays} className="w-5 h-5 text-primary" aria-hidden="true" />
                  <p className="text-lg font-bold text-text-primary">{property.yearBuilt}</p>
                  <p className="text-xs text-text-secondary">Year Built</p>
                </div>
              )}
              {property.floor != null && (
                <div className="rounded-xl border border-border bg-surface-raised p-4 flex flex-col items-center gap-1 text-center">
                  <FontAwesomeIcon icon={faLayerGroup} className="w-5 h-5 text-primary" aria-hidden="true" />
                  <p className="text-lg font-bold text-text-primary">
                    {property.floor}{property.totalFloors ? `/${property.totalFloors}` : ''}
                  </p>
                  <p className="text-xs text-text-secondary">Floor</p>
                </div>
              )}
              {property.parkingSpots != null && property.parkingSpots > 0 && (
                <div className="rounded-xl border border-border bg-surface-raised p-4 flex flex-col items-center gap-1 text-center">
                  <FontAwesomeIcon icon={faCar} className="w-5 h-5 text-primary" aria-hidden="true" />
                  <p className="text-lg font-bold text-text-primary">{property.parkingSpots}</p>
                  <p className="text-xs text-text-secondary">Parking</p>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="rounded-2xl border border-border bg-surface-raised p-6 space-y-3">
              <h2 className="text-base font-semibold text-text-primary">About this property</h2>
              <p className="text-sm text-text-secondary leading-relaxed">{property.description}</p>
            </div>

            {/* Features */}
            {property.features && property.features.length > 0 && (
              <div className="rounded-2xl border border-border bg-surface-raised p-6 space-y-4">
                <h2 className="text-base font-semibold text-text-primary">Features & Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {property.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-sm text-text-secondary">
                      <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-success shrink-0" aria-hidden="true" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Map placeholder */}
            <div className="rounded-2xl border border-border overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-surface-raised">
                <h2 className="text-base font-semibold text-text-primary">Location</h2>
                <p className="text-xs text-text-secondary mt-0.5">
                  {property.district ? `${property.district}, ` : ''}{property.city}
                </p>
              </div>
              <div className="relative h-52 bg-surface-overlay flex items-center justify-center">
                <img
                  src={`https://picsum.photos/seed/map-${property.propertyId}/800/300`}
                  alt="Map placeholder"
                  className="h-full w-full object-cover opacity-60"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white rounded-xl px-4 py-2 shadow-md text-sm text-text-secondary border border-border">
                    <FontAwesomeIcon icon={faLocationDot} className="w-4 h-4 text-primary mr-1.5" aria-hidden="true" />
                    {property.district ? `${property.district}, ` : ''}{property.city}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-5">
            {/* Price card */}
            <div className="rounded-2xl border border-border bg-surface-raised p-5 space-y-4 sticky top-20">
              <div>
                <p className="text-xs text-text-secondary uppercase tracking-wide">Price</p>
                <p className="text-3xl font-bold text-text-primary mt-1">
                  {formatPrice(property.price, property.currency)}
                </p>
                {property.listingType === 'RENT' && (
                  <p className="text-xs text-text-secondary mt-0.5">per month</p>
                )}
                {property.listingType === 'SHORT_TERM' && (
                  <p className="text-xs text-text-secondary mt-0.5">per night</p>
                )}
                {property.area && (
                  <p className="text-xs text-text-disabled mt-1">
                    ≈ {formatPrice(Math.round(property.price / property.area), property.currency)} / m²
                  </p>
                )}
              </div>

              {property.daysOnMarket != null && (
                <p className="text-xs text-text-secondary flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faClock} className="w-3.5 h-3.5 text-text-disabled" aria-hidden="true" />
                  {property.daysOnMarket === 0 ? 'Listed today' : `Listed ${property.daysOnMarket} day${property.daysOnMarket !== 1 ? 's' : ''} ago`}
                </p>
              )}

              <div className="space-y-2">
                <Button variant="primary" fullWidth size="md" onClick={() => setContactOpen(true)}>
                  <FontAwesomeIcon icon={faPhone} className="w-4 h-4 mr-2" aria-hidden="true" />
                  Request Viewing
                </Button>
                <Button variant="outline" fullWidth size="md" onClick={() => setContactOpen(true)}>
                  <FontAwesomeIcon icon={faPaperPlane} className="w-4 h-4 mr-2" aria-hidden="true" />
                  Send Message
                </Button>
              </div>
            </div>

            {/* Agent card */}
            {agent && (
              <div>
                <h2 className="text-sm font-semibold text-text-secondary mb-2 uppercase tracking-wide px-1">Listed by</h2>
                <AgentCard agent={agent} />
              </div>
            )}

            {/* Mortgage calculator */}
            {property.listingType === 'SALE' && (
              <MortgageCalculator
                defaultPrice={property.price}
                currency={property.currency}
              />
            )}
          </div>
        </div>

        {/* ── Similar properties ── */}
        {similar.length > 0 && (
          <section className="mt-14">
            <h2 className="text-xl font-bold text-text-primary mb-6">Similar Properties</h2>
            <div className="grid gap-5 sm:grid-cols-3">
              {similar.map((p) => (
                <PropertyCard
                  key={p.propertyId}
                  property={p}
                  href={`/theme/real-estate/properties/${p.slug}`}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ── Contact modal ── */}
      {contactOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Contact agent"
        >
          <div className="w-full max-w-md rounded-2xl bg-surface-base border border-border shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-text-primary">Contact Agent</h2>
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
                <p className="text-sm text-text-secondary">The agent will get back to you within 24 hours.</p>
                <Button variant="outline" size="sm" onClick={() => { setContactOpen(false); setSent(false); }}>Close</Button>
              </div>
            ) : (
              <form onSubmit={handleSend} className="space-y-4">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-medium text-text-secondary mb-1">Your Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name"
                    className="w-full px-3 py-2.5 rounded-lg border border-border bg-surface-raised text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-border-focus transition"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-xs font-medium text-text-secondary mb-1">Email</label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-3 py-2.5 rounded-lg border border-border bg-surface-raised text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-border-focus transition"
                  />
                </div>
                <div>
                  <label htmlFor="contact-msg" className="block text-xs font-medium text-text-secondary mb-1">Message</label>
                  <textarea
                    id="contact-msg"
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-border bg-surface-raised text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-border-focus transition resize-none"
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
