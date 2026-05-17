'use client';
import { use, useMemo, useState } from 'react';
import { notFound } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faMagnifyingGlass, faUsers } from '@fortawesome/free-solid-svg-icons';
import { AttendeeAvatarStack } from '@/modules/domains/event/attendees/AttendeeAvatarStack';
import { AttendeeRow, type AttendanceStatus } from '@/modules/domains/event/attendees/AttendeeRow';
import { EVENTS } from '../../../event.data';

type Attendee = {
  id: string;
  name: string;
  handle?: string;
  avatarUrl?: string;
  status: AttendanceStatus;
  checkedIn?: boolean;
  isFriend?: boolean;
};

const SAMPLE_ATTENDEES: Attendee[] = [
  { id: 'a-01', name: 'Ayşe Yılmaz',    handle: 'ayseyilmaz',    status: 'GOING',    isFriend: true, checkedIn: true },
  { id: 'a-02', name: 'Mert Demir',     handle: 'mertdemir',     status: 'GOING',    isFriend: true },
  { id: 'a-03', name: 'Selin Aksu',     handle: 'selinaksu',     status: 'GOING',    checkedIn: true },
  { id: 'a-04', name: 'Burak Kara',     handle: 'burakkara',     status: 'GOING' },
  { id: 'a-05', name: 'Deniz Şahin',    handle: 'deniz_s',       status: 'MAYBE',    isFriend: true },
  { id: 'a-06', name: 'Cem Koç',        handle: 'cemkoc',        status: 'GOING' },
  { id: 'a-07', name: 'Eren Polat',     handle: 'erenpolat',     status: 'WAITLIST' },
  { id: 'a-08', name: 'Zeynep Acar',    handle: 'zeynepacar',    status: 'GOING',    checkedIn: true },
  { id: 'a-09', name: 'Kaan Aydın',     handle: 'kaanaydin',     status: 'MAYBE' },
  { id: 'a-10', name: 'Pelin Tan',      handle: 'pelintan',      status: 'GOING',    isFriend: true },
  { id: 'a-11', name: 'Berk Öztürk',    handle: 'berkozturk',    status: 'GOING' },
  { id: 'a-12', name: 'Ezgi Şimşek',    handle: 'ezgi_s',        status: 'WAITLIST' },
];

const FILTERS: { id: 'all' | AttendanceStatus | 'friends'; label: string }[] = [
  { id: 'all',      label: 'All' },
  { id: 'GOING',    label: 'Going' },
  { id: 'MAYBE',    label: 'Maybe' },
  { id: 'WAITLIST', label: 'Waitlist' },
  { id: 'friends',  label: 'Friends' },
];

export default function EventAttendeesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const event = EVENTS.find((e) => e.slug === slug);
  if (!event) notFound();

  const [filter, setFilter] = useState<typeof FILTERS[number]['id']>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return SAMPLE_ATTENDEES.filter((a) => {
      if (filter === 'friends' && !a.isFriend) return false;
      if (filter !== 'all' && filter !== 'friends' && a.status !== filter) return false;
      if (q && !(a.name.toLowerCase().includes(q) || (a.handle?.toLowerCase().includes(q)))) return false;
      return true;
    });
  }, [filter, search]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <a
        href={`/theme/event/events/${slug}`}
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary mb-4 transition-colors"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-3" aria-hidden="true" />
        Back to event
      </a>

      <header className="mb-6">
        <p className="text-xs uppercase tracking-wide font-medium text-text-secondary">{event.title}</p>
        <h1 className="text-2xl font-bold text-text-primary inline-flex items-center gap-2">
          <FontAwesomeIcon icon={faUsers} className="w-5 h-5 text-text-secondary" aria-hidden="true" />
          Attendees
        </h1>
      </header>

      <div className="mb-6 rounded-xl border border-border bg-surface-raised p-5 shadow-sm">
        <AttendeeAvatarStack
          attendees={SAMPLE_ATTENDEES.map((a) => ({ id: a.id, name: a.name }))}
          totalCount={(event.totalCapacity ?? 0) - (event.remainingCapacity ?? 0)}
        />
      </div>

      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className={
                'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors ' +
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus ' +
                (filter === f.id
                  ? 'bg-primary text-primary-fg'
                  : 'bg-surface-overlay text-text-secondary hover:text-text-primary')
              }
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-base px-3 py-1.5 focus-within:ring-2 focus-within:ring-border-focus">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="w-3 h-3 text-text-secondary" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search attendees"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-text-primary placeholder:text-text-secondary outline-none w-44"
            aria-label="Search attendees"
          />
        </div>
      </div>

      <section
        aria-label="Attendee list"
        className="rounded-xl border border-border bg-surface-raised overflow-hidden shadow-sm"
      >
        {filtered.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-text-secondary italic">No matching attendees.</p>
        ) : (
          filtered.map((a) => (
            <AttendeeRow
              key={a.id}
              name={a.name}
              handle={a.handle}
              avatarUrl={a.avatarUrl}
              status={a.status}
              checkedIn={a.checkedIn}
              isFriend={a.isFriend}
              onMessage={() => undefined}
            />
          ))
        )}
      </section>
    </div>
  );
}
