'use client';
import type { ShowcaseComponent } from '../showcase.types';
import { CityPicker } from '@/modules/domains/event/CityPicker';
import { NavDropdown, NavDropdownHeader, NavTriggerButton } from '@/modules/domains/event/NavDropdown';
import { NavThemeSwitcher } from '@/modules/domains/event/NavThemeSwitcher';
import { NavLanguageSwitcher } from '@/modules/domains/event/NavLanguageSwitcher';
import { useNavPopover } from '@/modules/domains/event/useNavPopover';
import { EventOrderStatusBadge } from '@/modules/domains/event/EventOrderStatusBadge';
import { TicketRowMeta, TicketRowActions } from '@/modules/domains/event/TicketRowMeta';

const MOCK_VALID_ENTRY = { event: { title: 'Rock Festival 2026' }, ticket: { ticketId: 'TK-001', status: 'VALID' } };
const MOCK_USED_ENTRY  = { event: { title: 'Jazz Night' },         ticket: { ticketId: 'TK-002', status: 'USED'  } };
import { EventStatusBadge } from '@/modules/domains/event/EventStatusBadge';
import { EventFormatBadge } from '@/modules/domains/event/EventFormatBadge';
import { EventCategoryBadge } from '@/modules/domains/event/EventCategoryBadge';
import { EventCard } from '@/modules/domains/event/EventCard';
import { OrganizerCard } from '@/modules/domains/event/OrganizerCard';
import { SectionPricingCard } from '@/modules/domains/event/SectionPricingCard';
import { TicketCard } from '@/modules/domains/event/TicketCard';
import { EventInfoGrid } from '@/modules/domains/event/EventInfoGrid';
import { TicketSidebarBox } from '@/modules/domains/event/TicketSidebarBox';
import { StepIndicator } from '@/modules/domains/event/StepIndicator';
import { CheckoutSuccess } from '@/modules/domains/event/CheckoutSuccess';
import { HeroSlide } from '@/modules/domains/event/HeroSlide';
import { SeatMapPicker, buildSectionTree } from '@/modules/domains/event/SeatMapPicker';
import type { EventWithData, EventSectionPricing, Organizer, IssuedTicket, VenueSection, VenueSeat } from '@/modules/domains/event/types';
import type { SeatInfo, SectionNode, SectionMapShape } from '@/modules/domains/event/SeatMapPicker';
import { useState } from 'react';

/* ─── dark nav wrapper ─── */

function DarkNavWrap({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="inline-flex items-center gap-4 px-4 py-3 rounded-xl"
      style={{ background: '#111d2e', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      {children}
    </div>
  );
}

function NavDropdownDemo() {
  const { open, setOpen, ref } = useNavPopover();
  return (
    <div ref={ref} className="relative">
      <NavTriggerButton onClick={() => setOpen((p) => !p)} expanded={open}>
        Options
      </NavTriggerButton>
      {open && (
        <NavDropdown>
          <NavDropdownHeader>Choose one</NavDropdownHeader>
          <ul className="py-1 w-40">
            {['Option A', 'Option B', 'Option C'].map((item) => (
              <li key={item}>
                <button
                  className="w-full text-left px-3 py-2 text-sm transition-colors"
                  style={{ color: 'rgba(255,255,255,0.6)' }}
                  onClick={() => setOpen(false)}
                  onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </NavDropdown>
      )}
    </div>
  );
}

/* ─── interactive wrappers ─── */

function SeatMapDemo({ sections, max }: { sections: SectionNode[]; max?: number }) {
  const [selected, setSelected] = useState<string[]>([]);
  const toggle = (id: string) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  return (
    <SeatMapPicker
      sections={sections}
      selectedSeatIds={selected}
      onSeatToggle={toggle}
      maxSelectable={max}
      showStage
    />
  );
}

function SeatMapTheaterDemo() {
  const [selected, setSelected] = useState<string[]>([]);
  const toggle = (id: string) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const sections: VenueSection[] = [
    { sectionId: 'th-parket',   venueId: 'venue-theater', name: 'Parket',      label: 'Parket',      capacity: 96, sortOrder: 0 },
    { sectionId: 'th-sol',      venueId: 'venue-theater', name: 'Sol Yan',     label: 'Sol Yan',     capacity: 36, sortOrder: 1 },
    { sectionId: 'th-sag',      venueId: 'venue-theater', name: 'Sağ Yan',     label: 'Sağ Yan',     capacity: 36, sortOrder: 2 },
    { sectionId: 'th-balkon',   venueId: 'venue-theater', name: 'Üst Balkon',  label: 'Üst Balkon',  capacity: 70, sortOrder: 3 },
  ];

  const pricings: EventSectionPricing[] = [
    { eventSectionPricingId: 'th-p1', eventId: 'th-e',  sectionId: 'th-parket', name: 'Parket',     price: 1200, currency: 'TRY', capacity: 96, soldCount: 36, active: true },
    { eventSectionPricingId: 'th-p2', eventId: 'th-e',  sectionId: 'th-sol',    name: 'Sol Yan',   price: 800,  currency: 'TRY', capacity: 36, soldCount: 12, active: true },
    { eventSectionPricingId: 'th-p3', eventId: 'th-e',  sectionId: 'th-sag',    name: 'Sağ Yan',  price: 800,  currency: 'TRY', capacity: 36, soldCount: 12, active: true },
    { eventSectionPricingId: 'th-p4', eventId: 'th-e',  sectionId: 'th-balkon', name: 'Üst Balkon', price: 450, currency: 'TRY', capacity: 70, soldCount: 30, active: true },
  ];

  const seatInfos: SeatInfo[] = [];

  for (const row of ['A','B','C','D','E','F','G','H']) {
    for (let n = 1; n <= 12; n++) {
      const seatId = `th-parket-${row}${n}`;
      const status: SeatInfo['status'] =
        ['A','B','C'].includes(row) ? 'SOLD' :
        row === 'D' && n <= 2       ? 'HELD' : 'AVAILABLE';
      seatInfos.push({
        seat: { seatId, sectionId: 'th-parket', row, number: String(n), label: null, x: null, y: null, accessible: row === 'H' && n === 12, companionSeat: false },
        status,
      });
    }
  }

  for (const secId of ['th-sol', 'th-sag']) {
    for (const row of ['A','B','C','D','E','F']) {
      for (let n = 1; n <= 6; n++) {
        seatInfos.push({
          seat: { seatId: `${secId}-${row}${n}`, sectionId: secId, row, number: String(n), label: null, x: null, y: null, accessible: false, companionSeat: false },
          status: ['A','B'].includes(row) ? 'SOLD' : 'AVAILABLE',
        });
      }
    }
  }

  for (const row of ['A','B','C','D','E','F','G']) {
    for (let n = 1; n <= 10; n++) {
      seatInfos.push({
        seat: { seatId: `th-balkon-${row}${n}`, sectionId: 'th-balkon', row, number: String(n), label: null, x: null, y: null, accessible: row === 'G' && n === 5, companionSeat: false },
        status: ['A','B','C'].includes(row) ? 'SOLD' : 'AVAILABLE',
      });
    }
  }

  const tree = buildSectionTree(sections, seatInfos, pricings);

  const mapShapes: SectionMapShape[] = [
    { sectionId: 'th-parket', points: '170,93 510,93 558,290 122,290',                labelX: 340, labelY: 185, seatGridAngle:   0 },
    { sectionId: 'th-sol',    points: '32,93 170,93 122,290 18,248',                  labelX: 95,  labelY: 185, seatGridAngle:  14 },
    { sectionId: 'th-sag',    points: '510,93 648,93 662,248 558,290',                labelX: 585, labelY: 185, seatGridAngle: -14 },
    { sectionId: 'th-balkon', points: '18,248 122,290 558,290 662,248 674,438 6,438', labelX: 340, labelY: 360, seatGridAngle:   0 },
  ];

  return (
    <SeatMapPicker
      sections={tree}
      selectedSeatIds={selected}
      onSeatToggle={toggle}
      maxSelectable={6}
      mapShapes={mapShapes}
      mapViewBox="0 0 680 460"
      stagePoints="225,18 455,18 455,88 225,88"
      stageLabel="SAHNE"
      stageLabelX={340}
      stageLabelY={53}
    />
  );
}

/* ─── demo data ─── */

const DEMO_CATEGORY = {
  categoryId: 'cat-music',
  title: 'Müzik',
  slug: 'muzik',
  image: null,
};

const DEMO_ORGANIZER: Organizer = {
  organizerId: 'org-1',
  name: 'LiveNation Türkiye',
  slug: 'livenation-tr',
  description: 'Türkiye\'nin önde gelen etkinlik organizatörü.',
  logo: null,
  website: 'https://livenation.com',
  email: 'info@livenation.com.tr',
  phone: null,
  verified: true,
};

const DEMO_EVENT: EventWithData = {
  eventId: 'evt-1',
  title: 'Coldplay – Music of the Spheres World Tour',
  slug: 'coldplay-istanbul-2026',
  shortDescription: 'Coldplay\'in efsanevi dünya turnesinden İstanbul\'a görkemli bir durak.',
  description: 'Coldplay, Music of the Spheres World Tour kapsamında İstanbul\'a geliyor.',
  categoryId: 'cat-music',
  organizerId: 'org-1',
  format: 'PHYSICAL',
  startAt: new Date('2026-08-15T20:00:00'),
  endAt: new Date('2026-08-15T23:00:00'),
  timezone: 'Europe/Istanbul',
  image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
  bannerImage: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1600&q=80',
  status: 'PUBLISHED',
  visibility: 'PUBLIC',
  minPrice: 1500,
  maxPrice: 8500,
  currency: 'TRY',
  totalCapacity: 50000,
  remainingCapacity: 3200,
  onlineUrl: null,
  tags: ['coldplay', 'müzik', 'konser'],
  keywords: ['coldplay', 'istanbul', 'konser'],
  category: DEMO_CATEGORY,
  organizer: DEMO_ORGANIZER,
};

const DEMO_SOLD_OUT_EVENT: EventWithData = {
  ...DEMO_EVENT,
  eventId: 'evt-2',
  title: 'Istanbul Caz Festivali',
  slug: 'istanbul-caz-2026',
  status: 'SOLD_OUT',
  minPrice: 250,
  maxPrice: 1200,
  remainingCapacity: 0,
  image: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800&q=80',
  category: { categoryId: 'cat-music', title: 'Müzik', slug: 'muzik', image: null },
};

const DEMO_PRICINGS: EventSectionPricing[] = [
  {
    eventSectionPricingId: 'p1',
    eventId: 'evt-1',
    sectionId: 'sec-1',
    name: 'Genel Giriş',
    description: null,
    price: 1500,
    currency: 'TRY',
    capacity: 30000,
    soldCount: 27500,
    active: true,
  },
  {
    eventSectionPricingId: 'p2',
    eventId: 'evt-1',
    sectionId: 'sec-2',
    name: 'Oturma — Kategori B',
    description: null,
    price: 3500,
    currency: 'TRY',
    capacity: 15000,
    soldCount: 14983,
    active: true,
  },
  {
    eventSectionPricingId: 'p3',
    eventId: 'evt-1',
    sectionId: 'sec-3',
    name: 'VIP',
    description: null,
    price: 8500,
    currency: 'TRY',
    capacity: 5000,
    soldCount: 4200,
    active: true,
  },
];

const DEMO_TICKET: IssuedTicket = {
  ticketId: 'TKT-A1B2C3',
  orderId: 'ORD-XY9Z12',
  orderItemId: 'OI-TKT-A1B2C3',
  eventId: 'evt-1',
  sectionId: 'sec-1',
  seatId: 'seat-1',
  eventSeatId: 'eseat-1',
  pricingId: 'p1',
  attendeeName: 'Ahmet Yılmaz',
  attendeeEmail: 'ahmet@example.com',
  qrCode: 'QR-TKT-A1B2C3-EVT-1',
  barcode: null,
  status: 'VALID',
  checkedInAt: null,
  checkedInBy: null,
  transferredToUserId: null,
  transferredAt: null,
  createdAt: new Date(),
};

/* ─── builders ─── */

export function buildEventDomainData(): ShowcaseComponent[] {
  return [

    /* ── Badges ── */
    {
      id: 'event-status-badge',
      title: 'EventStatusBadge',
      category: 'Domain',
      abbr: 'ES',
      description: 'Etkinlik durumunu (PUBLISHED, SOLD_OUT, CANCELLED…) renkli badge ile gösterir.',
      filePath: 'modules/domains/event/EventStatusBadge.tsx',
      sourceCode: `import { EventStatusBadge } from '@/modules/domains/event/EventStatusBadge';
// DRAFT | PUBLISHED | SCHEDULED | CANCELLED | POSTPONED | SOLD_OUT | ARCHIVED
<EventStatusBadge status="PUBLISHED" />`,
      variants: [
        {
          title: 'Tüm durumlar',
          layout: 'stack',
          preview: (
            <div className="flex flex-wrap gap-2">
              {(['DRAFT', 'PUBLISHED', 'SCHEDULED', 'CANCELLED', 'POSTPONED', 'SOLD_OUT', 'ARCHIVED'] as const).map((s) => (
                <EventStatusBadge key={s} status={s} />
              ))}
            </div>
          ),
          code: `<EventStatusBadge status="DRAFT" />
<EventStatusBadge status="PUBLISHED" />
<EventStatusBadge status="SOLD_OUT" />`,
        },
        {
          title: 'Boyutlar',
          layout: 'stack',
          preview: (
            <div className="flex flex-wrap gap-2 items-center">
              <EventStatusBadge status="CANCELLED" size="sm" />
              <EventStatusBadge status="CANCELLED" size="md" />
            </div>
          ),
          code: `<EventStatusBadge status="CANCELLED" size="sm" />
<EventStatusBadge status="CANCELLED" size="md" />
<EventStatusBadge status="CANCELLED" size="lg" />`,
        },
      ],
    },

    {
      id: 'event-format-badge',
      title: 'EventFormatBadge',
      category: 'Domain',
      abbr: 'EF',
      description: 'Etkinlik formatını (PHYSICAL / ONLINE / HYBRID) emoji + etiket ile gösterir.',
      filePath: 'modules/domains/event/EventFormatBadge.tsx',
      sourceCode: `import { EventFormatBadge } from '@/modules/domains/event/EventFormatBadge';
<EventFormatBadge format="PHYSICAL" />`,
      variants: [
        {
          title: 'Tüm formatlar',
          layout: 'stack',
          preview: (
            <div className="flex flex-wrap gap-2">
              <EventFormatBadge format="PHYSICAL" />
              <EventFormatBadge format="ONLINE" />
              <EventFormatBadge format="HYBRID" />
            </div>
          ),
          code: `<EventFormatBadge format="PHYSICAL" />
<EventFormatBadge format="ONLINE" />
<EventFormatBadge format="HYBRID" />`,
        },
      ],
    },

    {
      id: 'event-category-badge',
      title: 'EventCategoryBadge',
      category: 'Domain',
      abbr: 'EC',
      description: 'Etkinlik kategorisini chip olarak gösterir; href verilirse tıklanabilir bağlantıya dönüşür.',
      filePath: 'modules/domains/event/EventCategoryBadge.tsx',
      sourceCode: `import { EventCategoryBadge } from '@/modules/domains/event/EventCategoryBadge';
<EventCategoryBadge category={category} />
<EventCategoryBadge category={category} href="/events?category=muzik" />`,
      variants: [
        {
          title: 'Badge ve link',
          layout: 'stack',
          preview: (
            <div className="flex flex-wrap gap-2">
              <EventCategoryBadge category={DEMO_CATEGORY} />
              <EventCategoryBadge category={{ title: 'Spor', slug: 'spor', image: null }} />
              <EventCategoryBadge category={DEMO_CATEGORY} href="#" />
            </div>
          ),
          code: `<EventCategoryBadge category={category} />
<EventCategoryBadge category={category} href="/events?category=muzik" />`,
        },
      ],
    },

    /* ── Cards ── */
    {
      id: 'event-card',
      title: 'EventCard',
      category: 'Domain',
      abbr: 'EV',
      description: '16:9 görsel, fiyat pill, kategori/durum/format badge ve organizatör bilgisi içeren tam etkinlik kartı.',
      filePath: 'modules/domains/event/EventCard.tsx',
      sourceCode: `import { EventCard } from '@/modules/domains/event/EventCard';
<EventCard event={event} />`,
      variants: [
        {
          title: 'Yayında',
          preview: <div className="w-72"><EventCard event={DEMO_EVENT} /></div>,
          code: `<EventCard event={event} />`,
        },
        {
          title: 'Satışı Bitti',
          preview: <div className="w-72"><EventCard event={DEMO_SOLD_OUT_EVENT} /></div>,
          code: `<EventCard event={soldOutEvent} />`,
        },
      ],
    },

    {
      id: 'organizer-card',
      title: 'OrganizerCard',
      category: 'Domain',
      abbr: 'OC',
      description: 'Organizatör logo/baş harfleri, isim, doğrulanmış rozetleri ve iletişim bağlantılarını gösterir.',
      filePath: 'modules/domains/event/OrganizerCard.tsx',
      sourceCode: `import { OrganizerCard } from '@/modules/domains/event/OrganizerCard';
<OrganizerCard organizer={organizer} />`,
      variants: [
        {
          title: 'Doğrulanmış organizatör',
          layout: 'stack',
          preview: <OrganizerCard organizer={DEMO_ORGANIZER} />,
          code: `<OrganizerCard organizer={organizer} />`,
        },
        {
          title: 'Logosuz',
          layout: 'stack',
          preview: <OrganizerCard organizer={{ ...DEMO_ORGANIZER, verified: false, website: null, email: null }} />,
          code: `<OrganizerCard organizer={{ ...organizer, verified: false }} />`,
        },
      ],
    },

    {
      id: 'section-pricing-card',
      title: 'SectionPricingCard',
      category: 'Domain',
      abbr: 'SP',
      description: 'Bilet kategorisi seçim kartı; −/+ adet kontrolü, kapasite uyarısı ve seçili durumu içerir.',
      filePath: 'modules/domains/event/SectionPricingCard.tsx',
      sourceCode: `import { SectionPricingCard } from '@/modules/domains/event/SectionPricingCard';
<SectionPricingCard
  pricing={pricing}
  quantity={2}
  onQuantityChange={(qty) => setQty(qty)}
  selected
/>`,
      variants: [
        {
          title: 'Seçili',
          layout: 'stack',
          preview: (
            <div className="w-full max-w-md space-y-3">
              <SectionPricingCard pricing={DEMO_PRICINGS[0]} quantity={2} onQuantityChange={() => {}} selected />
            </div>
          ),
          code: `<SectionPricingCard pricing={pricing} quantity={2} onQuantityChange={setQty} selected />`,
        },
        {
          title: 'Son koltuk uyarısı',
          layout: 'stack',
          preview: (
            <div className="w-full max-w-md space-y-3">
              <SectionPricingCard pricing={DEMO_PRICINGS[1]} quantity={0} onQuantityChange={() => {}} />
            </div>
          ),
          code: `// soldCount yakın olduğunda "Son X koltuk" uyarısı gösterilir
<SectionPricingCard pricing={pricing} quantity={0} onQuantityChange={setQty} />`,
        },
      ],
    },

    {
      id: 'ticket-card',
      title: 'TicketCard',
      category: 'Domain',
      abbr: 'TC',
      description: 'Kesik çizgili ayırıcı ve SVG QR koduyla tam bilet görseli.',
      filePath: 'modules/domains/event/TicketCard.tsx',
      sourceCode: `import { TicketCard } from '@/modules/domains/event/TicketCard';
<TicketCard
  ticket={ticket}
  event={{ title, startAt, venueName, venueCity }}
  section={{ sectionName: 'Genel Giriş' }}
/>`,
      variants: [
        {
          title: 'Yatay bilet (varsayılan)',
          layout: 'stack',
          preview: (
            <TicketCard
              ticket={DEMO_TICKET}
              event={{
                title: DEMO_EVENT.title,
                startAt: DEMO_EVENT.startAt,
                venueName: 'Atatürk Olimpiyat Stadyumu',
                venueCity: 'İstanbul',
              }}
              section={{ sectionName: 'Genel Giriş' }}
            />
          ),
          code: `<TicketCard
  ticket={ticket}
  event={{ title, startAt, venueName, venueCity }}
  section={{ sectionName: 'Genel Giriş' }}
/>`,
        },
        {
          title: 'Dikey bilet',
          layout: 'side',
          preview: (
            <div className="flex justify-center">
              <TicketCard
                ticket={DEMO_TICKET}
                event={{
                  title: DEMO_EVENT.title,
                  startAt: DEMO_EVENT.startAt,
                  venueName: 'Atatürk Olimpiyat Stadyumu',
                  venueCity: 'İstanbul',
                }}
                section={{ sectionName: 'Genel Giriş', seatLabel: 'B-14' }}
                orientation="vertical"
                className="w-72"
              />
            </div>
          ),
          code: `<TicketCard
  ticket={ticket}
  event={{ title, startAt, venueName, venueCity }}
  section={{ sectionName: 'Genel Giriş', seatLabel: 'B-14' }}
  orientation="vertical"
  className="w-72"
/>`,
        },
        {
          title: 'İptal bilet (dikey)',
          layout: 'side',
          preview: (
            <div className="flex justify-center">
              <TicketCard
                ticket={{ ...DEMO_TICKET, status: 'CANCELLED' }}
                event={{
                  title: DEMO_EVENT.title,
                  startAt: DEMO_EVENT.startAt,
                  venueName: 'Atatürk Olimpiyat Stadyumu',
                  venueCity: 'İstanbul',
                }}
                orientation="vertical"
                className="w-72"
              />
            </div>
          ),
          code: `<TicketCard
  ticket={{ ...ticket, status: 'CANCELLED' }}
  event={{ title, startAt, venueName, venueCity }}
  orientation="vertical"
  className="w-72"
/>`,
        },
      ],
    },

    /* ── New components ── */
    {
      id: 'event-info-grid',
      title: 'EventInfoGrid',
      category: 'Domain',
      abbr: 'EI',
      description: 'Etkinlik detay sayfası için tarih/saat, mekan, format ve doluluk oranı bilgilerini düzenli bir kart içinde gösterir.',
      filePath: 'modules/domains/event/EventInfoGrid.tsx',
      sourceCode: `import { EventInfoGrid } from '@/modules/domains/event/EventInfoGrid';
<EventInfoGrid
  event={event}
  venue={{ name: 'Atatürk Olimpiyat Stadyumu', address: 'Başakşehir, İstanbul' }}
/>`,
      variants: [
        {
          title: 'Tüm alanlar',
          layout: 'stack',
          preview: (
            <EventInfoGrid
              event={DEMO_EVENT}
              venue={{ name: 'Atatürk Olimpiyat Stadyumu', address: 'Başakşehir, İstanbul' }}
            />
          ),
          code: `<EventInfoGrid event={event} venue={venue} />`,
        },
        {
          title: 'Online etkinlik (mekan yok)',
          layout: 'stack',
          preview: (
            <EventInfoGrid
              event={{ ...DEMO_EVENT, format: 'ONLINE', remainingCapacity: null }}
              venue={null}
            />
          ),
          code: `<EventInfoGrid event={{ ...event, format: 'ONLINE' }} venue={null} />`,
        },
      ],
    },

    {
      id: 'ticket-sidebar-box',
      title: 'TicketSidebarBox',
      category: 'Domain',
      abbr: 'TB',
      description: 'Etkinlik detay sayfasının yapışkan sağ kenar çubuğu: fiyat başlığı, fiyatlandırma listesi, satın al butonu ve harita.',
      filePath: 'modules/domains/event/TicketSidebarBox.tsx',
      sourceCode: `import { TicketSidebarBox } from '@/modules/domains/event/TicketSidebarBox';
<TicketSidebarBox
  priceLabel="₺1.500 – ₺8.500"
  pricings={pricings}
  canBuy={true}
  isSoldOut={false}
  isCancelled={false}
  eventSlug="coldplay-istanbul-2026"
  remainingCapacity={3200}
  venue={{ name: 'Atatürk Olimpiyat Stadyumu', address: 'Başakşehir', city: 'İstanbul' }}
/>`,
      variants: [
        {
          title: 'Satın alınabilir',
          layout: 'stack',
          preview: (
            <div className="w-80">
              <TicketSidebarBox
                priceLabel="₺1.500 – ₺8.500"
                pricings={DEMO_PRICINGS}
                canBuy
                isSoldOut={false}
                isCancelled={false}
                eventSlug="coldplay-istanbul-2026"
                remainingCapacity={800}
                venue={{ venueId: 'venue-ataturk', slug: 'ataturk-olimpiyat', name: 'Atatürk Olimpiyat Stadyumu', address: 'Başakşehir', city: 'İstanbul', country: 'Türkiye', latitude: 41.0038, longitude: 28.6741 }}
              />
            </div>
          ),
          code: `<TicketSidebarBox
  priceLabel="₺1.500 – ₺8.500"
  pricings={pricings}
  canBuy={true}
  isSoldOut={false}
  isCancelled={false}
  eventSlug={event.slug}
  remainingCapacity={800}
  venue={venue}
/>`,
        },
        {
          title: 'Satışı bitti',
          layout: 'stack',
          preview: (
            <div className="w-80">
              <TicketSidebarBox
                priceLabel="₺250 – ₺1.200"
                pricings={[]}
                canBuy={false}
                isSoldOut
                isCancelled={false}
                eventSlug="istanbul-caz-2026"
                remainingCapacity={0}
              />
            </div>
          ),
          code: `<TicketSidebarBox canBuy={false} isSoldOut={true} ... />`,
        },
      ],
    },

    {
      id: 'step-indicator',
      title: 'StepIndicator',
      category: 'Domain',
      abbr: 'SI',
      description: 'Ödeme akışı (Biletler → Bilgiler → Ödeme → Onay) için 4 adımlı ilerleme göstergesi.',
      filePath: 'modules/domains/event/StepIndicator.tsx',
      sourceCode: `import { StepIndicator } from '@/modules/domains/event/StepIndicator';
// 'tickets' | 'buyer' | 'payment' | 'confirm'
<StepIndicator current="payment" />`,
      variants: [
        {
          title: 'Tüm adım durumları',
          layout: 'stack',
          preview: (
            <div className="space-y-6">
              {(['tickets', 'buyer', 'payment', 'confirm'] as const).map((step) => (
                <div key={step} className="space-y-1">
                  <p className="text-xs text-text-secondary font-mono">{step}</p>
                  <StepIndicator current={step} />
                </div>
              ))}
            </div>
          ),
          code: `<StepIndicator current="tickets" />
<StepIndicator current="buyer" />
<StepIndicator current="payment" />
<StepIndicator current="confirm" />`,
        },
      ],
    },

    {
      id: 'checkout-success',
      title: 'CheckoutSuccess',
      category: 'Domain',
      abbr: 'CS',
      description: 'Başarılı ödeme sonrası gösterilen onay ekranı: QR bilet, sipariş özeti, yazdır/geri dön butonları.',
      filePath: 'modules/domains/event/CheckoutSuccess.tsx',
      sourceCode: `import { CheckoutSuccess } from '@/modules/domains/event/CheckoutSuccess';
<CheckoutSuccess
  orderId="ORD-XY9Z12"
  ticketId="TKT-A1B2C3"
  buyerName="Ahmet Yılmaz"
  buyerEmail="ahmet@example.com"
  event={{ eventId, title, startAt, slug }}
  venue={{ name, city }}
  cartItems={[{ pricing, quantity: 2 }]}
  total={3000}
/>`,
      variants: [
        {
          title: 'Başarı ekranı',
          layout: 'stack',
          preview: (
            <CheckoutSuccess
              orderId="ORD-XY9Z12"
              ticketId="TKT-A1B2C3"
              buyerName="Ahmet Yılmaz"
              buyerEmail="ahmet@example.com"
              event={{
                eventId: DEMO_EVENT.eventId,
                title: DEMO_EVENT.title,
                startAt: DEMO_EVENT.startAt,
                slug: DEMO_EVENT.slug,
              }}
              venue={{ name: 'Atatürk Olimpiyat Stadyumu', city: 'İstanbul' }}
              cartItems={[{ pricing: DEMO_PRICINGS[0], quantity: 2 }]}
              total={3000}
            />
          ),
          code: `<CheckoutSuccess
  orderId="ORD-XY9Z12"
  ticketId="TKT-A1B2C3"
  buyerName="Ahmet Yılmaz"
  buyerEmail="ahmet@example.com"
  event={event}
  venue={venue}
  cartItems={cartItems}
  total={total}
/>`,
        },
      ],
    },

    {
      id: 'seat-map-picker',
      title: 'SeatMapPicker',
      category: 'Domain',
      abbr: 'SM',
      description: 'Görsel koltuk seçim haritası: section/subsection sekme desteği, sıra-koltuk grid, renk kodlu durum, erişilebilirlik göstergesi.',
      filePath: 'modules/domains/event/SeatMapPicker/index.tsx',
      sourceCode: `import { SeatMapPicker, buildSectionTree } from '@/modules/domains/event/SeatMapPicker';

// Flat veriden ağaç oluştur
const sections = buildSectionTree(allSections, seatInfos, pricings);

<SeatMapPicker
  sections={sections}
  selectedSeatIds={selected}
  onSeatToggle={(id) => toggleSeat(id)}
  maxSelectable={4}
  showStage
/>`,
      variants: (() => {
        /* ── demo sections & seats ── */
        const SEC_FLOOR: VenueSection = { sectionId: 'sec-floor', venueId: 'venue-demo', parentSectionId: null, name: 'Zemin', label: 'Zemin Kat', capacity: 60, sortOrder: 0 };
        const SEC_BALCONY: VenueSection = { sectionId: 'sec-balcony', venueId: 'venue-demo', parentSectionId: null, name: 'Balkon', label: 'Balkon', capacity: 40, sortOrder: 1 };
        const SEC_VIP: VenueSection = { sectionId: 'sec-vip', venueId: 'venue-demo', parentSectionId: null, name: 'VIP', label: 'VIP', capacity: 20, sortOrder: 2 };

        // Subsections of Zemin
        const SEC_FLOOR_L: VenueSection = { sectionId: 'sec-floor-l', venueId: 'venue-demo', parentSectionId: 'sec-floor', name: 'Sol Blok', label: 'Sol', capacity: 30, sortOrder: 0 };
        const SEC_FLOOR_R: VenueSection = { sectionId: 'sec-floor-r', venueId: 'venue-demo', parentSectionId: 'sec-floor', name: 'Sağ Blok', label: 'Sağ', capacity: 30, sortOrder: 1 };

        function makeSeat(sectionId: string, row: string, num: number, opts?: Partial<VenueSeat>): SeatInfo {
          const seatId = `${sectionId}-${row}${num}`;
          return {
            seat: { seatId, sectionId, row, number: String(num), label: null, x: null, y: null, accessible: false, companionSeat: false, ...opts },
            status: 'AVAILABLE',
          };
        }

        // Floor Left: rows A-D, 8 seats each, some sold/held
        const floorLSeats: SeatInfo[] = [];
        for (const row of ['A', 'B', 'C', 'D']) {
          for (let n = 1; n <= 8; n++) {
            const id = `sec-floor-l-${row}${n}`;
            let status: 'AVAILABLE' | 'SOLD' | 'HELD' = 'AVAILABLE';
            if ((row === 'A' && n <= 3) || (row === 'B' && n === 5)) status = 'SOLD';
            if (row === 'C' && (n === 2 || n === 3)) status = 'HELD';
            floorLSeats.push({
              seat: { seatId: id, sectionId: 'sec-floor-l', row, number: String(n), label: null, x: null, y: null, accessible: n === 8, companionSeat: false },
              status,
            });
          }
        }

        // Floor Right: rows A-D, 8 seats each
        const floorRSeats: SeatInfo[] = [];
        for (const row of ['A', 'B', 'C', 'D']) {
          for (let n = 1; n <= 8; n++) {
            floorRSeats.push({ ...makeSeat('sec-floor-r', row, n), status: (row === 'A' && n > 5) ? 'SOLD' : 'AVAILABLE' });
          }
        }

        // Balcony: rows E-G, 10 seats, flat (no subsections)
        const balconySeats: SeatInfo[] = [];
        for (const row of ['E', 'F', 'G']) {
          for (let n = 1; n <= 10; n++) {
            balconySeats.push({ ...makeSeat('sec-balcony', row, n), status: (row === 'E' && n <= 4) ? 'SOLD' : 'AVAILABLE' });
          }
        }

        // VIP: rows V1-V2, 6 seats
        const vipSeats: SeatInfo[] = [];
        for (const row of ['V1', 'V2']) {
          for (let n = 1; n <= 6; n++) {
            vipSeats.push(makeSeat('sec-vip', row, n));
          }
        }

        const pricings: EventSectionPricing[] = [
          { eventSectionPricingId: 'p-fl', eventId: 'evt-1', sectionId: 'sec-floor-l', name: 'Zemin Sol', price: 2500, currency: 'TRY', capacity: 30, soldCount: 7, active: true },
          { eventSectionPricingId: 'p-fr', eventId: 'evt-1', sectionId: 'sec-floor-r', name: 'Zemin Sağ', price: 2500, currency: 'TRY', capacity: 30, soldCount: 5, active: true },
          { eventSectionPricingId: 'p-b',  eventId: 'evt-1', sectionId: 'sec-balcony',  name: 'Balkon',     price: 1200, currency: 'TRY', capacity: 40, soldCount: 12, active: true },
          { eventSectionPricingId: 'p-v',  eventId: 'evt-1', sectionId: 'sec-vip',      name: 'VIP',        price: 8500, currency: 'TRY', capacity: 20, soldCount: 0, active: true },
        ];

        const allSections = [SEC_FLOOR, SEC_BALCONY, SEC_VIP, SEC_FLOOR_L, SEC_FLOOR_R];
        const allSeats = [...floorLSeats, ...floorRSeats, ...balconySeats, ...vipSeats];
        const sectionTree = buildSectionTree(allSections, allSeats, pricings);

        return [
          {
            title: 'Section + subsection + koltuk seçimi',
            layout: 'stack' as const,
            preview: <SeatMapDemo sections={sectionTree} max={4} />,
            code: `const sections = buildSectionTree(allSections, seatInfos, pricings);

<SeatMapPicker
  sections={sections}
  selectedSeatIds={selected}
  onSeatToggle={(id) => toggleSeat(id)}
  maxSelectable={4}
  showStage
/>`,
          },
          {
            title: 'SVG Salon Haritası — tıkla → koltuk seç',
            layout: 'stack' as const,
            preview: <SeatMapTheaterDemo />,
            code: `import type { SectionMapShape } from '@/modules/domains/event/SeatMapPicker';

const mapShapes: SectionMapShape[] = [
  { sectionId: 'parket',     points: '170,93 510,93 558,290 122,290',                labelX: 340, labelY: 185 },
  { sectionId: 'sol-yan',   points: '32,93 170,93 122,290 18,248',                  labelX: 95,  labelY: 185 },
  { sectionId: 'sag-yan',   points: '510,93 648,93 662,248 558,290',                labelX: 585, labelY: 185 },
  { sectionId: 'ust-balkon', points: '18,248 122,290 558,290 662,248 674,438 6,438', labelX: 340, labelY: 360 },
];

<SeatMapPicker
  sections={sections}
  selectedSeatIds={selected}
  onSeatToggle={(id) => toggleSeat(id)}
  maxSelectable={6}
  mapShapes={mapShapes}
  mapViewBox="0 0 680 460"
  stagePoints="225,18 455,18 455,88 225,88"
  stageLabel="SAHNE"
  stageLabelX={340}
  stageLabelY={53}
/>`,
          },
        ];
      })(),
    },

    {
      id: 'hero-slide',
      title: 'HeroSlide',
      category: 'Domain',
      abbr: 'HS',
      description: 'Slider içinde kullanılan tam ekran hero slayt: çift gradyan katmanı, badge\'ler, fiyat, CTA butonları.',
      filePath: 'modules/domains/event/HeroSlide.tsx',
      sourceCode: `import { HeroSlide } from '@/modules/domains/event/HeroSlide';
import { Slider } from '@/modules/ui/Slider';

const slides = events.map((e) => <HeroSlide key={e.eventId} event={e} />);
<Slider slides={slides} autoPlay showDots showArrows loop className="rounded-none" />`,
      variants: [
        {
          title: 'Tek slayt önizleme',
          layout: 'stack',
          preview: (
            <div className="rounded-xl overflow-hidden" style={{ background: '#0a1220' }}>
              <HeroSlide event={DEMO_EVENT} />
            </div>
          ),
          code: `<HeroSlide event={event} />`,
        },
      ],
    },

    /* ── Nav bileşenleri ── */

    {
      id: 'event-nav-dropdown',
      title: 'NavDropdown',
      category: 'Domain',
      abbr: 'NdD',
      description: 'Event koyu nav barı için dropdown bileşen ailesi: NavDropdown kapsayıcı, NavDropdownHeader başlık, NavTriggerButton tetikleyici. useNavPopover hook\'u ile kullanılır.',
      filePath: 'modules/domains/event/NavDropdown.tsx',
      sourceCode: `import { NavDropdown, NavDropdownHeader, NavTriggerButton } from '@/modules/domains/event/NavDropdown';
import { useNavPopover } from '@/modules/domains/event/useNavPopover';

function MyPicker() {
  const { open, setOpen, ref } = useNavPopover();
  return (
    <div ref={ref} className="relative">
      <NavTriggerButton onClick={() => setOpen(p => !p)} expanded={open}>
        Select city
      </NavTriggerButton>
      {open && (
        <NavDropdown>
          <NavDropdownHeader>Choose</NavDropdownHeader>
          <ul>{...}</ul>
        </NavDropdown>
      )}
    </div>
  );
}`,
      variants: [
        {
          title: 'Dropdown açık/kapalı',
          layout: 'stack' as const,
          preview: (
            <DarkNavWrap>
              <NavDropdownDemo />
            </DarkNavWrap>
          ),
          code: `const { open, setOpen, ref } = useNavPopover();

<div ref={ref} className="relative">
  <NavTriggerButton onClick={() => setOpen(p => !p)} expanded={open}>
    Options
  </NavTriggerButton>
  {open && (
    <NavDropdown>
      <NavDropdownHeader>Choose one</NavDropdownHeader>
      <ul>{...}</ul>
    </NavDropdown>
  )}
</div>`,
        },
      ],
    },

    {
      id: 'event-city-picker',
      title: 'CityPicker',
      category: 'Domain',
      abbr: 'CiP',
      description: 'Event nav barı için şehir seçici dropdown; varsayılan Türkiye şehirleri, props ile özelleştirilebilir.',
      filePath: 'modules/domains/event/CityPicker.tsx',
      sourceCode: `import { CityPicker } from '@/modules/domains/event/CityPicker';

// Varsayılan şehirler
<CityPicker />

// Özelleştirme
<CityPicker
  cities={[
    { id: 'berlin', label: 'Berlin', count: 42 },
    { id: 'munich', label: 'Munich', count: 18 },
  ]}
  allCitiesHref="/cities"
/>`,
      variants: [
        {
          title: 'Varsayılan',
          layout: 'stack' as const,
          preview: (
            <DarkNavWrap>
              <CityPicker />
            </DarkNavWrap>
          ),
          code: `<CityPicker />`,
        },
        {
          title: 'Özel şehir listesi',
          layout: 'stack' as const,
          preview: (
            <DarkNavWrap>
              <CityPicker
                cities={[
                  { id: 'berlin', label: 'Berlin', count: 42 },
                  { id: 'munich', label: 'Munich', count: 18 },
                  { id: 'hamburg', label: 'Hamburg', count: 11 },
                ]}
              />
            </DarkNavWrap>
          ),
          code: `<CityPicker cities={customCities} allCitiesHref="/cities" />`,
        },
      ],
    },

    {
      id: 'event-nav-language-switcher',
      title: 'NavLanguageSwitcher',
      category: 'Domain',
      abbr: 'NLS',
      description: 'Event koyu nav barına özel dil seçici; bayrak emojileri ve seçili işareti. Mevcut LanguageSwitcher\'dan bağımsız koyu tema variant\'ı.',
      filePath: 'modules/domains/event/NavLanguageSwitcher.tsx',
      sourceCode: `import { NavLanguageSwitcher } from '@/modules/domains/event/NavLanguageSwitcher';

// Varsayılan diller (TR, EN, DE, FR, AR, RU)
<NavLanguageSwitcher />

// Kontrollü mod
<NavLanguageSwitcher
  value={lang}
  onChange={(id) => setLang(id)}
/>`,
      variants: [
        {
          title: 'Nav içinde',
          layout: 'stack' as const,
          preview: (
            <DarkNavWrap>
              <NavLanguageSwitcher />
            </DarkNavWrap>
          ),
          code: `<NavLanguageSwitcher />`,
        },
      ],
    },

    {
      id: 'event-nav-theme-switcher',
      title: 'NavThemeSwitcher',
      category: 'Domain',
      abbr: 'NTS',
      description: 'Event koyu nav barına özel tema değiştirici (Açık / Koyu / Sistem); localStorage\'a yazar ve html.dark class\'ını yönetir.',
      filePath: 'modules/domains/event/NavThemeSwitcher.tsx',
      sourceCode: `import { NavThemeSwitcher } from '@/modules/domains/event/NavThemeSwitcher';

// Koyu nav barı içinde kullanım
<NavThemeSwitcher />`,
      variants: [
        {
          title: 'Nav içinde',
          layout: 'stack' as const,
          preview: (
            <DarkNavWrap>
              <NavThemeSwitcher />
            </DarkNavWrap>
          ),
          code: `<NavThemeSwitcher />`,
        },
        {
          title: 'Birlikte kullanım',
          layout: 'stack' as const,
          preview: (
            <DarkNavWrap>
              <NavThemeSwitcher />
              <span className="h-3 w-px" style={{ background: 'rgba(255,255,255,0.12)' }} />
              <NavLanguageSwitcher />
              <span className="h-3 w-px" style={{ background: 'rgba(255,255,255,0.12)' }} />
              <CityPicker />
            </DarkNavWrap>
          ),
          code: `// Tipik event nav bar üst çubuğu:
<NavThemeSwitcher />
<TopBarDivider />
<NavLanguageSwitcher />
<TopBarDivider />
<CityPicker />`,
        },
      ],
    },

    {
      id: 'event-order-status-badge',
      title: 'EventOrderStatusBadge',
      category: 'Domain',
      abbr: 'OB',
      description: 'Sipariş durumu rozeti; PAID / REFUNDED / CANCELLED renk şeması, iki boyut seçeneği.',
      filePath: 'modules/domains/event/EventOrderStatusBadge.tsx',
      sourceCode: `import { EventOrderStatusBadge } from '@/modules/domains/event/EventOrderStatusBadge';

<EventOrderStatusBadge status="PAID" />
<EventOrderStatusBadge status="REFUNDED" size="md" />
<EventOrderStatusBadge status="CANCELLED" />`,
      variants: [
        {
          title: 'All statuses — sm',
          layout: 'stack' as const,
          preview: (
            <div className="flex items-center gap-2">
              <EventOrderStatusBadge status="PAID" />
              <EventOrderStatusBadge status="REFUNDED" />
              <EventOrderStatusBadge status="CANCELLED" />
            </div>
          ),
          code: `<EventOrderStatusBadge status="PAID" />
<EventOrderStatusBadge status="REFUNDED" />
<EventOrderStatusBadge status="CANCELLED" />`,
        },
        {
          title: 'Size md (detail view)',
          layout: 'stack' as const,
          preview: (
            <div className="flex items-center gap-2">
              <EventOrderStatusBadge status="PAID"      size="md" />
              <EventOrderStatusBadge status="REFUNDED"  size="md" />
              <EventOrderStatusBadge status="CANCELLED" size="md" />
            </div>
          ),
          code: `<EventOrderStatusBadge status="PAID"      size="md" />
<EventOrderStatusBadge status="REFUNDED"  size="md" />
<EventOrderStatusBadge status="CANCELLED" size="md" />`,
        },
      ],
    },

    {
      id: 'event-ticket-row-meta',
      title: 'TicketRowMeta + TicketRowActions',
      category: 'Domain',
      abbr: 'TM',
      description: 'Bilet listesi satırı başlığı: etkinlik küçük resmi, durum rozeti (TicketRowMeta) ve yazdır / paylaş butonları (TicketRowActions).',
      filePath: 'modules/domains/event/TicketRowMeta.tsx',
      sourceCode: `import { TicketRowMeta, TicketRowActions } from '@/modules/domains/event/TicketRowMeta';

const entry = {
  event:  { image: '/img/event.jpg', title: 'Rock Festival 2026' },
  ticket: { ticketId: 'TK-001', status: 'VALID' },
};

<div className="flex items-center justify-between px-1">
  <TicketRowMeta   entry={entry} />
  <TicketRowActions entry={entry} />
</div>`,
      variants: [
        {
          title: 'Default',
          layout: 'stack' as const,
          preview: (
            <div className="flex items-center justify-between px-1 border border-border rounded-xl p-3">
              <TicketRowMeta entry={MOCK_VALID_ENTRY} />
              <TicketRowActions entry={MOCK_VALID_ENTRY} />
            </div>
          ),
          code: `<div className="flex items-center justify-between px-1">
  <TicketRowMeta   entry={entry} />
  <TicketRowActions entry={entry} />
</div>`,
        },
        {
          title: 'Compact (vertical layout)',
          layout: 'stack' as const,
          preview: (
            <div className="flex items-start justify-between px-1 border border-border rounded-xl p-3">
              <TicketRowMeta entry={MOCK_USED_ENTRY} compact />
              <TicketRowActions entry={MOCK_USED_ENTRY} compact />
            </div>
          ),
          code: `<TicketRowMeta   entry={entry} compact />
<TicketRowActions entry={entry} compact />`,
        },
      ],
    },

  ];
}
