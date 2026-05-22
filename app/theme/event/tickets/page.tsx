'use client';
import { useState, useMemo } from 'react';
import { DocumentTitle } from '@/libs/utils/DocumentTitle';
import { THEME_TITLES } from '@/libs/config/showcase.config';
import { TicketCard } from '@/modules/domains/event/TicketCard';
import { EmptyState } from '@/modules/ui/EmptyState';
import { StatCard } from '@/modules/ui/StatCard';
import { TabButton } from '@/modules/ui/TabButton';
import { ViewToggle, type ViewOrientation } from '@/modules/ui/ViewToggle';
import { TicketRowMeta, TicketRowActions } from '@/modules/domains/event/TicketRowMeta';
import { MY_TICKETS } from '@/app/theme/event/event.data';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTicket } from '@fortawesome/free-solid-svg-icons';

type FilterTab = 'all' | 'upcoming' | 'past' | 'cancelled';

const FMT_CURRENCY = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  maximumFractionDigits: 0,
});

/* ════════════════════════════════════════════════════════
   Page
════════════════════════════════════════════════════════ */

const now = new Date();

export default function MyTicketsPage() {
  const [tab, setTab]               = useState<FilterTab>('all');
  const [orientation, setOrientation] = useState<ViewOrientation>('horizontal');

  /* counts */
  const counts = useMemo(() => {
    const all      = MY_TICKETS.length;
    const upcoming = MY_TICKETS.filter((e) => e.ticket.status === 'VALID' && e.event.startAt > now).length;
    const past     = MY_TICKETS.filter((e) => e.ticket.status === 'USED' || (e.ticket.status === 'VALID' && e.event.startAt <= now)).length;
    const cancelled = MY_TICKETS.filter((e) => e.ticket.status === 'CANCELLED' || e.ticket.status === 'TRANSFERRED' || e.ticket.status === 'REFUNDED').length;
    return { all, upcoming, past, cancelled };
  }, []);

  /* filtered list */
  const filtered = useMemo(() => {
    if (tab === 'upcoming')  return MY_TICKETS.filter((e) => e.ticket.status === 'VALID' && e.event.startAt > now);
    if (tab === 'past')      return MY_TICKETS.filter((e) => e.ticket.status === 'USED' || (e.ticket.status === 'VALID' && e.event.startAt <= now));
    if (tab === 'cancelled') return MY_TICKETS.filter((e) => ['CANCELLED', 'TRANSFERRED', 'REFUNDED'].includes(e.ticket.status));
    return MY_TICKETS;
  }, [tab]);

  /* total spend */
  const totalSpend = MY_TICKETS
    .filter((e) => !['CANCELLED', 'REFUNDED'].includes(e.ticket.status))
    .reduce((s, e) => s + e.price, 0);

  /* ── render ── */

  return (
    <div className="min-h-screen bg-surface-base">
      <DocumentTitle text={`Tickets — ${THEME_TITLES.event}`} />

      {/* ── hero banner ── */}
      <div className="bg-gradient-to-br from-primary to-secondary px-6 py-10">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            {/* user info */}
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-primary-fg/20 border-2 border-primary-fg/30 flex items-center justify-center text-2xl font-black text-primary-fg shrink-0">
                J
              </div>
              <div>
                <p className="text-sm text-primary-fg/70 font-medium">Merhaba,</p>
                <h1 className="text-xl font-black text-primary-fg">John Nolan</h1>
                <p className="text-xs text-primary-fg/60 mt-0.5">john.nolan@example.com</p>
              </div>
            </div>

            {/* stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Toplam Bilet', value: counts.all },
                { label: 'Yaklaşan',     value: counts.upcoming },
                { label: 'Harcama',      value: FMT_CURRENCY.format(totalSpend) },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl px-4 py-3 text-center"
                  style={{ background: 'rgba(255,255,255,0.15)' }}
                >
                  <p className="text-lg font-black text-primary-fg tabular-nums">{s.value}</p>
                  <p className="text-[10px] text-primary-fg/70 mt-0.5 whitespace-nowrap">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── content ── */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 space-y-6">

        {/* ── status summary strip ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Geçerli Bilet" value={MY_TICKETS.filter((e) => e.ticket.status === 'VALID').length}       accent="text-success" />
          <StatCard label="Kullanılan"     value={MY_TICKETS.filter((e) => e.ticket.status === 'USED').length}        accent="text-text-secondary" />
          <StatCard label="Transfer"        value={MY_TICKETS.filter((e) => e.ticket.status === 'TRANSFERRED').length} accent="text-info" />
          <StatCard label="İptal"           value={MY_TICKETS.filter((e) => e.ticket.status === 'CANCELLED').length}   accent="text-error" />
        </div>

        {/* ── filter bar ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1 flex-wrap">
            <TabButton active={tab === 'all'}       onClick={() => setTab('all')}       count={counts.all}>Tümü</TabButton>
            <TabButton active={tab === 'upcoming'}  onClick={() => setTab('upcoming')}  count={counts.upcoming}>Yaklaşan</TabButton>
            <TabButton active={tab === 'past'}      onClick={() => setTab('past')}      count={counts.past}>Geçmiş</TabButton>
            <TabButton active={tab === 'cancelled'} onClick={() => setTab('cancelled')} count={counts.cancelled}>İptal / Transfer</TabButton>
          </div>
          <ViewToggle
            value={orientation}
            onChange={setOrientation}
            labels={{ horizontal: 'Yatay', vertical: 'Dikey' }}
            ariaLabel="Görünüm seçenekleri"
          />
        </div>

        {/* ── ticket list ── */}
        {filtered.length === 0 ? (
          <EmptyState
            icon={<FontAwesomeIcon icon={faTicket} className="w-5 h-5" aria-hidden="true" />}
            title="Bilet bulunamadı"
            description="Bu kategoride biletiniz bulunmuyor."
          />
        ) : orientation === 'horizontal' ? (
          <div className="space-y-4">
            {filtered.map((entry) => (
              <TicketCardRow key={entry.ticket.ticketId} entry={entry} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((entry) => (
              <VerticalTicketCell key={entry.ticket.ticketId} entry={entry} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── horizontal row ── */

type EntryProps = { entry: (typeof MY_TICKETS)[number] };

function TicketCardRow({ entry }: EntryProps) {
  return (
    <div className="group">
      <div className="flex items-center justify-between mb-2 px-1">
        <TicketRowMeta entry={entry} />
        <TicketRowActions entry={entry} />
      </div>
      <div id={`ticket-print-${entry.ticket.ticketId}`}>
        <TicketCard ticket={entry.ticket} event={entry.event} section={entry.section} orientation="horizontal" />
      </div>
    </div>
  );
}

/* ── vertical cell ── */

function VerticalTicketCell({ entry }: EntryProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-start justify-between px-1">
        <TicketRowMeta entry={entry} compact />
        <TicketRowActions entry={entry} compact />
      </div>
      <div id={`ticket-print-${entry.ticket.ticketId}`}>
        <TicketCard ticket={entry.ticket} event={entry.event} section={entry.section} orientation="vertical" />
      </div>
    </div>
  );
}
