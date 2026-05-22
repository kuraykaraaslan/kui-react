import type { Metadata } from 'next';
import { THEME_TITLES } from '@/libs/config/showcase.config';
import { Slider } from '@/modules/ui/Slider';
import { EventCard } from '@/modules/domains/event/EventCard';
import { HeroSlide } from '@/modules/domains/event/HeroSlide';
import {
  EVENTS,
  EVENT_CATEGORIES,
} from '@/app/theme/event/event.data';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMusic, faTrophy, faMasksTheater, faLaptop, faFaceSmile, faStar, faTicket } from '@fortawesome/free-solid-svg-icons';

export const metadata: Metadata = {
  title: { absolute: THEME_TITLES.event },
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'cat-music':      <FontAwesomeIcon icon={faMusic} className="w-6 h-6" aria-hidden="true" />,
  'cat-sports':     <FontAwesomeIcon icon={faTrophy} className="w-6 h-6" aria-hidden="true" />,
  'cat-theater':    <FontAwesomeIcon icon={faMasksTheater} className="w-6 h-6" aria-hidden="true" />,
  'cat-conference': <FontAwesomeIcon icon={faLaptop} className="w-6 h-6" aria-hidden="true" />,
  'cat-comedy':     <FontAwesomeIcon icon={faFaceSmile} className="w-6 h-6" aria-hidden="true" />,
  'cat-festival':   <FontAwesomeIcon icon={faStar} className="w-6 h-6" aria-hidden="true" />,
};

const HERO_EVENTS = EVENTS
  .filter((e) => e.status === 'PUBLISHED' && (e.bannerImage ?? e.image))
  .slice(0, 4);

/* ════════════════════════════════════════════════════
   Page
════════════════════════════════════════════════════ */

export default function EventThemePage() {
  const heroSlides = HERO_EVENTS.map((event) => <HeroSlide key={event.eventId} event={event} />);


  return (
    <div>
      <style>{`
        @keyframes evt-fade { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* ── Hero Slider ── */}
      <section style={{ background: '#0a1220' }}>
        <Slider
          slides={heroSlides}
          autoPlay
          autoPlayInterval={6000}
          showDots
          showArrows
          loop
          className="rounded-none"
        />
      </section>

      {/* ── Categories ── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-text-primary">Kategoriler</h2>
          <a href="/theme/event/events" className="text-sm text-primary hover:underline">
            Tümünü gör →
          </a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {EVENT_CATEGORIES.map((cat) => (
            <a
              key={cat.categoryId}
              href={`/theme/event/events?category=${cat.slug}`}
              className="flex flex-col items-center gap-2 rounded-xl border border-border bg-surface-raised p-4 hover:border-primary hover:bg-primary-subtle transition-all text-center group"
            >
              <span>{CATEGORY_ICONS[cat.categoryId] ?? <FontAwesomeIcon icon={faTicket} className="w-6 h-6" aria-hidden="true" />}</span>
              <span className="text-xs font-semibold text-text-secondary group-hover:text-primary transition-colors">
                {cat.title}
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* ── Upcoming Events ── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-text-primary">Yaklaşan Etkinlikler</h2>
            <p className="text-text-secondary text-sm mt-1">
              {EVENTS.length} etkinlik sizi bekliyor
            </p>
          </div>
          <a
            href="/theme/event/events"
            className="inline-flex items-center justify-center rounded-md border border-border text-text-primary hover:bg-surface-overlay px-3 py-1.5 text-sm font-medium transition-colors"
          >
            Tümünü Gör
          </a>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {EVENTS.slice(0, 6).map((event, i) => (
            <div
              key={event.eventId}
              className="motion-safe:animate-[evt-fade_0.6s_ease-out]"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <EventCard event={event} />
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #1e2060 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{ background: 'radial-gradient(ellipse at 80% 50%, #3b82f6 0%, transparent 65%)' }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-14 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-black text-white">Etkinliklerden Haberdar Ol</h2>
            <p className="text-white/65 mt-1 text-sm">
              Sana özel etkinlikleri kaçırmamak için bildirimlere kaydol.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <a
              href="#"
              className="inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-colors"
              style={{ border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.08)' }}
            >
              Daha Fazla Bilgi
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-bold text-white transition-all"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)', boxShadow: '0 4px 16px rgba(59,130,246,0.4)' }}
            >
              Ücretsiz Kaydol
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
