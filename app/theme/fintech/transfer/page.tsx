'use client';
import { useState } from 'react';
import { DocumentTitle } from '@/libs/utils/DocumentTitle';
import { THEME_TITLES } from '@/libs/config/showcase.config';
import { Button } from '@/modules/ui/Button';
import { Input } from '@/modules/ui/Input';
import { Select } from '@/modules/ui/Select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPaperPlane,
  faArrowRightArrowLeft,
  faLock,
  faShieldHalved,
  faCheckCircle,
  faUser,
  faClock,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { WALLETS } from '../fintech.data';

const WALLET_OPTIONS = WALLETS
  .filter((w) => w.status === 'ACTIVE')
  .map((w) => ({
    value: w.walletId,
    label: `${w.currency} — Available: ${w.currency === 'TRY' ? '₺' : w.currency === 'USD' ? '$' : w.currency === 'EUR' ? '€' : ''}${w.availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
  }));

const CURRENCY_OPTIONS = [
  { value: 'TRY', label: '₺ TRY — Turkish Lira' },
  { value: 'USD', label: '$ USD — US Dollar' },
  { value: 'EUR', label: '€ EUR — Euro' },
  { value: 'GBP', label: '£ GBP — British Pound' },
];

const RECENT_CONTACTS = [
  { name: 'Sarah K.', email: 'sarah.k@example.com', initial: 'S', color: 'bg-[#e8f0fe] text-[#1a73e8]' },
  { name: 'Mike T.',  email: 'mike.t@example.com',  initial: 'M', color: 'bg-[#fce8e6] text-[#d93025]' },
  { name: 'Lena A.',  email: 'lena.a@example.com',  initial: 'L', color: 'bg-[#e6f4ea] text-[#188038]' },
  { name: 'Omar N.',  email: 'omar.n@example.com',  initial: 'O', color: 'bg-[#fef7e0] text-[#e37400]' },
];

type Step = 'recipient' | 'amount' | 'review';

export default function TransferPage() {
  const [step, setStep] = useState<Step>('recipient');
  const [recipient, setRecipient] = useState('');
  const [fromWallet, setFromWallet] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('TRY');
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const selectedWallet = WALLETS.find((w) => w.walletId === fromWallet);
  const numAmount = parseFloat(amount) || 0;
  const fee = numAmount > 0 ? 2.50 : 0;
  const total = numAmount + fee;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-md px-6 py-20 text-center space-y-5">
        <DocumentTitle text={`Transfer — ${THEME_TITLES['fintech']}`} />
        <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-full bg-[#e6f4ea]">
          <FontAwesomeIcon icon={faCheckCircle} className="w-10 h-10 text-[#188038]" aria-hidden="true" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-text-primary">You sent {currency === 'TRY' ? '₺' : currency === 'USD' ? '$' : '€'}{numAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h2>
          <p className="text-text-secondary text-sm">
            Your payment has been sent. {recipient || 'The recipient'} will be notified immediately.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-surface-raised p-5 text-left space-y-3">
          {[
            { label: 'To',          value: recipient || 'friend@example.com' },
            { label: 'Amount',      value: `${currency === 'TRY' ? '₺' : '$'}${numAmount.toFixed(2)}` },
            { label: 'Fee',         value: `₺${fee.toFixed(2)}` },
            { label: 'Status',      value: 'Sent' },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">{row.label}</span>
              <span className="font-semibold text-text-primary">{row.value}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-3 justify-center pt-2">
          <Button variant="outline" size="md" className="rounded-full" onClick={() => { setSubmitted(false); setStep('recipient'); setAmount(''); setRecipient(''); }}>
            Send Again
          </Button>
          <Button as="a" href="/theme/fintech/transactions" variant="primary" size="md" className="rounded-full">
            View Activity
          </Button>
        </div>
      </div>
    );
  }

  const STEPS: { key: Step; label: string }[] = [
    { key: 'recipient', label: 'Recipient' },
    { key: 'amount',    label: 'Amount' },
    { key: 'review',    label: 'Review' },
  ];

  const stepIdx = STEPS.findIndex((s) => s.key === step);

  return (
    <div className="bg-[#f5f7fa] min-h-screen">
      <DocumentTitle text={`Transfer — ${THEME_TITLES['fintech']}`} />
      <div className="mx-auto max-w-lg px-4 py-10 space-y-6">

        {/* Page header */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-black text-text-primary">Send Money</h1>
          <p className="text-text-secondary text-sm">Fast, secure, and free for friends</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-0">
          {STEPS.map((s, i) => (
            <div key={s.key} className="flex items-center">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${i < stepIdx ? 'bg-primary text-primary-fg' : i === stepIdx ? 'bg-[#003087] text-white' : 'bg-surface-sunken text-text-secondary'}`}>
                {i < stepIdx ? (
                  <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4" aria-hidden="true" />
                ) : (
                  i + 1
                )}
              </div>
              <span className={`ml-1.5 text-xs font-medium hidden sm:inline ${i === stepIdx ? 'text-text-primary' : 'text-text-secondary'}`}>{s.label}</span>
              {i < STEPS.length - 1 && (
                <div className={`w-8 sm:w-12 h-0.5 mx-2 ${i < stepIdx ? 'bg-primary' : 'bg-surface-sunken'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-border bg-surface-base shadow-lg overflow-hidden">

          {/* Step 1: Recipient */}
          {step === 'recipient' && (
            <div className="p-6 space-y-5">
              <h2 className="text-base font-bold text-text-primary">Who are you sending to?</h2>

              {/* Recent contacts */}
              <div>
                <p className="text-xs text-text-secondary mb-3 font-medium uppercase tracking-wider">Recent</p>
                <div className="grid grid-cols-4 gap-2">
                  {RECENT_CONTACTS.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setRecipient(c.email)}
                      className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all ${recipient === c.email ? 'border-primary bg-primary-subtle' : 'border-border hover:border-primary/40 hover:bg-surface-overlay'}`}
                    >
                      <span className={`flex h-10 w-10 items-center justify-center rounded-full font-bold text-sm ${c.color}`}>
                        {c.initial}
                      </span>
                      <span className="text-xs font-medium text-text-primary truncate w-full text-center">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative flex items-center gap-3">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-text-secondary">or send to a new contact</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <div className="space-y-3">
                <Input
                  id="recipient-email"
                  label="Email or mobile number"
                  type="email"
                  placeholder="friend@example.com"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />
              </div>

              <Button
                variant="primary"
                fullWidth
                size="lg"
                className="rounded-full font-bold"
                onClick={() => setStep('amount')}
                disabled={!recipient}
                iconRight={<FontAwesomeIcon icon={faChevronRight} className="w-4 h-4" aria-hidden="true" />}
              >
                Continue
              </Button>
            </div>
          )}

          {/* Step 2: Amount */}
          {step === 'amount' && (
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-3">
                <button onClick={() => setStep('recipient')} className="text-primary hover:underline text-sm font-medium">
                  ← Back
                </button>
                <div className="flex items-center gap-2 ml-auto rounded-full bg-surface-raised border border-border px-3 py-1.5">
                  <FontAwesomeIcon icon={faUser} className="w-3.5 h-3.5 text-text-secondary" aria-hidden="true" />
                  <span className="text-sm font-medium text-text-primary truncate max-w-[180px]">{recipient}</span>
                </div>
              </div>

              {/* Big amount input */}
              <div className="flex flex-col items-center gap-2 py-4">
                <p className="text-xs text-text-secondary uppercase tracking-wider font-medium">Enter Amount</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-text-primary">{currency === 'TRY' ? '₺' : currency === 'USD' ? '$' : '€'}</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    min="0.01"
                    step="0.01"
                    className="text-5xl font-black text-text-primary bg-transparent border-none outline-none w-48 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    aria-label="Amount"
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  {['50', '100', '250', '500'].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setAmount(preset)}
                      className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${amount === preset ? 'border-primary bg-primary text-primary-fg' : 'border-border text-text-secondary hover:border-primary hover:text-primary'}`}
                    >
                      {currency === 'TRY' ? '₺' : '$'}{preset}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex gap-3 items-end">
                  <div className="w-40">
                    <Select
                      id="currency"
                      label="Currency"
                      options={CURRENCY_OPTIONS}
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <Select
                      id="from-wallet"
                      label="From Wallet"
                      options={WALLET_OPTIONS}
                      placeholder="Select wallet"
                      value={fromWallet}
                      onChange={(e) => setFromWallet(e.target.value)}
                    />
                  </div>
                </div>
                <Input
                  id="note"
                  label="Add a note (optional)"
                  placeholder="What's it for?"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>

              <Button
                variant="primary"
                fullWidth
                size="lg"
                className="rounded-full font-bold"
                onClick={() => setStep('review')}
                disabled={!amount || parseFloat(amount) <= 0}
                iconRight={<FontAwesomeIcon icon={faChevronRight} className="w-4 h-4" aria-hidden="true" />}
              >
                Continue
              </Button>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 'review' && (
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="flex items-center gap-3 mb-2">
                <button type="button" onClick={() => setStep('amount')} className="text-primary hover:underline text-sm font-medium">
                  ← Back
                </button>
                <h2 className="text-base font-bold text-text-primary ml-auto">Review & Confirm</h2>
              </div>

              {/* Summary card */}
              <div className="rounded-2xl bg-[#f5f7fa] border border-border p-5 space-y-3">
                <div className="flex items-center gap-3 pb-3 border-b border-border">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-fg font-bold text-xl flex-shrink-0">
                    {recipient.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-primary">Sending to</p>
                    <p className="text-sm text-text-secondary">{recipient}</p>
                  </div>
                </div>

                {[
                  { label: 'Amount',    value: `${currency === 'TRY' ? '₺' : currency === 'USD' ? '$' : '€'}${numAmount.toFixed(2)}` },
                  { label: 'Fee',       value: `₺${fee.toFixed(2)}` },
                  { label: 'From',      value: selectedWallet ? `${selectedWallet.currency} Wallet` : '—' },
                  ...(note ? [{ label: 'Note', value: note }] : []),
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">{row.label}</span>
                    <span className="font-semibold text-text-primary">{row.value}</span>
                  </div>
                ))}

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-sm font-bold text-text-primary">Total</span>
                  <span className="text-lg font-black text-primary">₺{total.toFixed(2)}</span>
                </div>
              </div>

              {/* FX rate notice */}
              <div className="flex items-center gap-2 rounded-xl border border-border bg-surface-raised px-4 py-3">
                <FontAwesomeIcon icon={faArrowRightArrowLeft} className="w-4 h-4 text-primary flex-shrink-0" aria-hidden="true" />
                <p className="text-xs text-text-secondary">
                  Great exchange rates on international transfers. <a href="/theme/fintech/transactions" className="text-primary font-semibold">Compare rates</a>
                </p>
              </div>

              {/* Delivery time */}
              <div className="flex items-center gap-2 text-xs text-text-secondary">
                <FontAwesomeIcon icon={faClock} className="w-3.5 h-3.5 text-success-fg" aria-hidden="true" />
                <span>Usually arrives <strong className="text-text-primary">instantly</strong> · up to 1 business day</span>
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                size="lg"
                className="rounded-full font-black text-base"
                iconLeft={<FontAwesomeIcon icon={faPaperPlane} className="w-4 h-4" aria-hidden="true" />}
              >
                Send ₺{total.toFixed(2)} Now
              </Button>

              <div className="flex items-center justify-center gap-1.5 text-xs text-text-secondary">
                <FontAwesomeIcon icon={faLock} className="w-3 h-3 text-success-fg" aria-hidden="true" />
                <span>Secured with 256-bit SSL encryption</span>
                <FontAwesomeIcon icon={faShieldHalved} className="w-3 h-3 text-success-fg ml-2" aria-hidden="true" />
                <span>PayFlow Buyer Protection</span>
              </div>

              <p className="text-center text-xs text-text-secondary">
                By sending, you agree to our{' '}
                <a href="/theme/fintech" className="text-primary hover:underline">User Agreement</a>{' '}
                and{' '}
                <a href="/theme/fintech" className="text-primary hover:underline">Privacy Policy</a>.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
