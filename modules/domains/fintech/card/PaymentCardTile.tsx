'use client';
import { cn } from '@/libs/utils/cn';
import { Badge } from '@/modules/ui/Badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCreditCard,
  faSnowflake,
  faMobileScreen,
  faWifi,
} from '@fortawesome/free-solid-svg-icons';
import { faCcVisa, faCcMastercard, faCcAmex } from '@fortawesome/free-brands-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export type PaymentCardKind = 'virtual' | 'physical';
export type PaymentCardScheme = 'visa' | 'mastercard' | 'amex';
export type PaymentCardStatus = 'active' | 'frozen' | 'expired';

type PaymentCardTileProps = {
  nickname: string;
  scheme: PaymentCardScheme;
  kind: PaymentCardKind;
  status: PaymentCardStatus;
  last4: string;
  expiry?: string;
  cardholderName?: string;
  className?: string;
};

const SCHEME_ICON: Record<PaymentCardScheme, IconDefinition> = {
  visa: faCcVisa,
  mastercard: faCcMastercard,
  amex: faCcAmex,
};

const SCHEME_GRADIENT: Record<PaymentCardScheme, string> = {
  visa:       'from-blue-600 to-indigo-700',
  mastercard: 'from-red-500 to-orange-500',
  amex:       'from-slate-700 to-slate-900',
};

const STATUS_BADGE: Record<PaymentCardStatus, { label: string; variant: 'success' | 'warning' | 'error' }> = {
  active: { label: 'Active', variant: 'success' },
  frozen: { label: 'Frozen', variant: 'warning' },
  expired: { label: 'Expired', variant: 'error' },
};

export function PaymentCardTile({
  nickname,
  scheme,
  kind,
  status,
  last4,
  expiry,
  cardholderName,
  className,
}: PaymentCardTileProps) {
  const badge = STATUS_BADGE[status];

  return (
    <article
      className={cn(
        'relative overflow-hidden rounded-2xl bg-gradient-to-br p-5 text-white shadow-md',
        SCHEME_GRADIENT[scheme],
        status === 'frozen' && 'opacity-70',
        status === 'expired' && 'opacity-50 grayscale',
        className,
      )}
      aria-label={`${kind} ${scheme} card ending ${last4}`}
    >
      {/* Decorative shapes */}
      <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/10" aria-hidden="true" />
      <div className="absolute -bottom-12 -left-8 h-32 w-32 rounded-full bg-white/5" aria-hidden="true" />

      <div className="relative flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <FontAwesomeIcon icon={faCreditCard} className="w-4 h-4 opacity-80" aria-hidden="true" />
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{nickname}</p>
            <p className="text-[11px] uppercase tracking-wide opacity-70 inline-flex items-center gap-1">
              <FontAwesomeIcon
                icon={kind === 'virtual' ? faMobileScreen : faWifi}
                className="w-2.5 h-2.5"
                aria-hidden="true"
              />
              {kind === 'virtual' ? 'Virtual' : 'Physical'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {status === 'frozen' && (
            <FontAwesomeIcon icon={faSnowflake} className="w-4 h-4 text-info" aria-hidden="true" />
          )}
          <Badge variant={badge.variant} size="sm" className="border border-white/40">
            {badge.label}
          </Badge>
        </div>
      </div>

      <div className="relative mt-8 flex items-end justify-between gap-2">
        <div>
          <p className="font-mono text-lg tracking-widest tabular-nums">
            •••• {last4}
          </p>
          {cardholderName && (
            <p className="mt-1 text-[11px] uppercase tracking-wide opacity-75">{cardholderName}</p>
          )}
          {expiry && (
            <p className="text-[11px] opacity-70 tabular-nums">Exp {expiry}</p>
          )}
        </div>
        <FontAwesomeIcon icon={SCHEME_ICON[scheme]} className="w-9 h-9" aria-hidden="true" />
      </div>
    </article>
  );
}
