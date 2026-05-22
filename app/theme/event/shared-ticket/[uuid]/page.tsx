'use client';
import { use, useState } from 'react';
import { DocumentTitle } from '@/libs/utils/DocumentTitle';
import { THEME_TITLES } from '@/libs/config/showcase.config';
import { TicketCard } from '@/modules/domains/event/TicketCard';
import { getTicketById } from '@/app/theme/event/event.data';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint, faLink, faTicket } from '@fortawesome/free-solid-svg-icons';

/* ── print isolation helper ──────────────────────────────
   Injects a <style> that hides everything on the page
   except #shared-ticket-print, triggers window.print(),
   then removes the style so the screen view is unaffected.
──────────────────────────────────────────────────────── */
function printTicket() {
  const STYLE_ID = '__ticket-print-style__';
  const existing = document.getElementById(STYLE_ID);
  if (existing) existing.remove();

  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    @media print {
      body > * { display: none !important; }
      #shared-ticket-print { display: block !important; }
    }
  `;
  document.head.appendChild(style);
  window.print();
  // Remove after the print dialog closes (afterprint fires on all modern browsers)
  window.addEventListener('afterprint', () => style.remove(), { once: true });
}

/* ── copy-to-clipboard hook ── */
function useCopyUrl() {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return { copied, copy };
}

/* ════════════════════════════════════════════════════════
   Page
════════════════════════════════════════════════════════ */

export default function SharedTicketPage({ params }: { params: Promise<{ uuid: string }> }) {
  const { uuid } = use(params);
  const entry = getTicketById(uuid);
  const { copied, copy } = useCopyUrl();

  /* ── not found ── */
  if (!entry) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-surface-base px-4">
        <DocumentTitle text={`Shared Ticket — ${THEME_TITLES.event}`} />
        <FontAwesomeIcon icon={faTicket} className="w-12 h-12 text-text-disabled" aria-hidden="true" />
        <h1 className="text-xl font-bold text-text-primary">Bilet bulunamadı</h1>
        <p className="text-sm text-text-secondary text-center max-w-xs">
          Bu bağlantı geçersiz ya da süresi dolmuş olabilir.
        </p>
        <a
          href="/theme/event"
          className="mt-2 px-5 py-2.5 rounded-lg bg-primary text-primary-fg text-sm font-semibold hover:bg-primary-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
        >
          Etkinliklere Göz At
        </a>
      </div>
    );
  }

  const { ticket, event, section } = entry;

  return (
    <div className="min-h-screen bg-surface-base flex flex-col">
      <DocumentTitle text={`Shared Ticket — ${event.title} — ${THEME_TITLES.event}`} />

      {/* ── minimal header ── */}
      <header className="border-b border-border bg-surface-raised print:hidden">
        <div className="mx-auto max-w-2xl px-4 h-14 flex items-center justify-between">
          <a
            href="/theme/event"
            className="flex items-center gap-2 text-sm font-bold text-text-primary hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus rounded"
          >
            <FontAwesomeIcon icon={faTicket} className="w-5 h-5" aria-hidden="true" />
            <span>BiletMaster</span>
          </a>
          <span className="text-xs text-text-secondary">Paylaşılan Bilet</span>
        </div>
      </header>

      {/* ── content ── */}
      <main className="flex-1 flex flex-col items-center justify-start py-10 px-4 gap-6">

        {/* intro text – screen only */}
        <div className="text-center print:hidden">
          <p className="text-text-secondary text-sm">
            <span className="font-semibold text-text-primary">{ticket.attendeeName ?? 'Bir kullanıcı'}</span>
            {' '}bu bileti sizinle paylaştı.
          </p>
        </div>

        {/* ticket – this div is targeted by the print style */}
        <div id="shared-ticket-print" className="w-full max-w-xl">
          <TicketCard
            ticket={ticket}
            event={event}
            section={section}
            orientation="horizontal"
          />
        </div>

        {/* action bar – screen only */}
        <div className="flex flex-wrap items-center justify-center gap-2 print:hidden">
          <button
            onClick={printTicket}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors',
              'bg-primary text-primary-fg hover:bg-primary-hover',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
            )}
          >
            <FontAwesomeIcon icon={faPrint} className="w-4 h-4" aria-hidden="true" />
            Yazdır
          </button>

          <button
            onClick={copy}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors',
              'border border-border bg-surface-raised hover:bg-surface-overlay text-text-primary',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
            )}
          >
            <FontAwesomeIcon icon={faLink} className="w-4 h-4" aria-hidden="true" />
            {copied ? 'Kopyalandı!' : 'Bağlantıyı Kopyala'}
          </button>
        </div>

        {/* disclaimer */}
        <p className="text-[11px] text-text-disabled text-center max-w-xs print:hidden">
          Bu bilet yalnızca görüntüleme amaçlıdır. Girişte asıl bilet sahibinin kimliği kontrol edilebilir.
        </p>

      </main>
    </div>
  );
}

