import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPlane } from '@fortawesome/free-solid-svg-icons';
import { ItineraryDayCard } from '@/modules/domains/travel/itinerary/ItineraryDayCard';
import { TripTimelineItem, type TimelineItemKind } from '@/modules/domains/travel/itinerary/TripTimelineItem';

type Stop = {
  kind: TimelineItemKind;
  title: string;
  location?: string;
  time: string;
  durationLabel?: string;
  note?: string;
  bookingRef?: string;
};

type Day = {
  dayNumber: number;
  date: string;
  city: string;
  summary: string;
  totalDurationHours: number;
  stops: Stop[];
};

const ITINERARY: { tripTitle: string; subtitle: string; days: Day[] } = {
  tripTitle: 'Istanbul → Cappadocia long weekend',
  subtitle: '4 days · 2 travellers · departing Friday',
  days: [
    {
      dayNumber: 1,
      date: '2026-05-22',
      city: 'Istanbul',
      summary: 'Arrival, Bosphorus dinner, early night.',
      totalDurationHours: 10,
      stops: [
        { kind: 'flight',   title: 'LHR → IST on Turkish TK-1980', location: 'London Heathrow → Istanbul (IST)', time: '10:25 — 16:40', durationLabel: '4h 15m', bookingRef: 'TK-A19QC' },
        { kind: 'transfer', title: 'Private transfer to Beyoğlu',  location: 'IST → Pera Palace Hotel',           time: '17:30 — 18:25', durationLabel: '55m' },
        { kind: 'hotel',    title: 'Check-in: Pera Palace',        location: 'Tepebaşı, Beyoğlu',                  time: '18:30', note: '2 nights, Bosphorus-view suite. Late checkout requested.' },
        { kind: 'meal',     title: 'Dinner at Mikla',              location: 'The Marmara Pera, rooftop',          time: '20:30', durationLabel: '~2h', note: 'Tasting menu booked.' },
      ],
    },
    {
      dayNumber: 2,
      date: '2026-05-23',
      city: 'Istanbul',
      summary: 'Old city walk, Grand Bazaar, hammam.',
      totalDurationHours: 9,
      stops: [
        { kind: 'meal',     title: 'Breakfast: Van Kahvaltı Evi',  location: 'Beyoğlu',                  time: '09:00' },
        { kind: 'activity', title: 'Hagia Sophia + Blue Mosque',   location: 'Sultanahmet',              time: '10:30 — 13:00', durationLabel: '2h 30m', note: 'Guided audio tour included.' },
        { kind: 'meal',     title: 'Lunch: Sehzade Cağ Kebabı',    location: 'Sirkeci',                  time: '13:30', durationLabel: '1h' },
        { kind: 'activity', title: 'Grand Bazaar wander',          location: 'Kapalıçarşı',              time: '15:00 — 17:00', durationLabel: '2h' },
        { kind: 'activity', title: 'Hammam at Cağaloğlu',          location: 'Cağaloğlu Hamamı',         time: '18:30 — 20:00', durationLabel: '1h 30m', note: 'Full bath + scrub + massage.' },
      ],
    },
    {
      dayNumber: 3,
      date: '2026-05-24',
      city: 'Cappadocia (Göreme)',
      summary: 'Domestic flight to Cappadocia, valley sunset.',
      totalDurationHours: 8,
      stops: [
        { kind: 'flight',   title: 'IST → ASR Turkish TK-2014',    location: 'Istanbul → Kayseri',       time: '11:10 — 12:35', durationLabel: '1h 25m', bookingRef: 'TK-B22XR' },
        { kind: 'transfer', title: 'Shuttle to Göreme',            location: 'Kayseri → Göreme',         time: '13:00 — 14:15', durationLabel: '1h 15m' },
        { kind: 'hotel',    title: 'Check-in: Museum Hotel',       location: 'Uçhisar',                  time: '14:30', note: 'Cave suite, 1 night.' },
        { kind: 'coffee',   title: 'Coffee at Cappadocia Coffee',  location: 'Göreme village center',    time: '16:00' },
        { kind: 'activity', title: 'Sunset at Red Valley',         location: 'Red Valley viewpoint',     time: '19:30 — 20:30', durationLabel: '1h' },
      ],
    },
    {
      dayNumber: 4,
      date: '2026-05-25',
      city: 'Cappadocia → home',
      summary: 'Hot-air balloon at dawn, return home.',
      totalDurationHours: 12,
      stops: [
        { kind: 'activity', title: 'Hot-air balloon ride',         location: 'Göreme launch site',       time: '04:45 — 07:30', durationLabel: '~2h 45m', note: 'Champagne breakfast included on landing.' },
        { kind: 'transfer', title: 'Shuttle to Kayseri',           location: 'Göreme → ASR',             time: '11:00 — 12:00', durationLabel: '1h' },
        { kind: 'flight',   title: 'ASR → IST → LHR',              location: 'Kayseri → London',         time: '13:25 — 18:20', durationLabel: '~5h connection', bookingRef: 'TK-A19QC' },
      ],
    },
  ],
};

export default function ItineraryPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <a
        href="/theme/travel"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary mb-4 transition-colors"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-3" aria-hidden="true" />
        Back home
      </a>

      <header className="mb-8 flex items-center gap-3">
        <span
          className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-subtle text-primary"
          aria-hidden="true"
        >
          <FontAwesomeIcon icon={faPlane} className="w-5 h-5" />
        </span>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">{ITINERARY.tripTitle}</h1>
          <p className="mt-0.5 text-sm text-text-secondary">{ITINERARY.subtitle}</p>
        </div>
      </header>

      <div className="space-y-8">
        {ITINERARY.days.map((day) => (
          <article key={day.dayNumber} className="space-y-3">
            <ItineraryDayCard
              dayNumber={day.dayNumber}
              date={day.date}
              city={day.city}
              summary={day.summary}
              itemCount={day.stops.length}
              totalDurationHours={day.totalDurationHours}
            />
            <ol className="rounded-xl border border-border bg-surface-base p-5 shadow-sm">
              {day.stops.map((s, i) => (
                <TripTimelineItem
                  key={i}
                  kind={s.kind}
                  title={s.title}
                  location={s.location}
                  time={s.time}
                  durationLabel={s.durationLabel}
                  note={s.note}
                  bookingRef={s.bookingRef}
                />
              ))}
            </ol>
          </article>
        ))}
      </div>
    </div>
  );
}
