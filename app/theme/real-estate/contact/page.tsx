'use client';
import { useState } from 'react';
import { DocumentTitle } from '@/libs/utils/DocumentTitle';
import { THEME_TITLES } from '@/libs/config/showcase.config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPhone,
  faEnvelope,
  faLocationDot,
  faClock,
  faPaperPlane,
  faCheckCircle,
  faBuilding,
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/modules/ui/Button';
import { cn } from '@/libs/utils/cn';

const OFFICES = [
  {
    city: 'Istanbul',
    address: 'Levent Mah. Cömert Sok. No:4 Kat:12, Beşiktaş, 34330 Istanbul',
    phone: '+90 212 555 01 23',
    email: 'istanbul@estateview.com',
    hours: 'Mon–Fri 09:00–18:00',
  },
  {
    city: 'Ankara',
    address: 'Kızılay Mah. Atatürk Blv. No:88 Kat:5, Çankaya, 06420 Ankara',
    phone: '+90 312 555 04 56',
    email: 'ankara@estateview.com',
    hours: 'Mon–Fri 09:00–18:00',
  },
  {
    city: 'Izmir',
    address: 'Alsancak Mah. Kıbrıs Şehitleri Cad. No:12 Kat:3, Konak, 35210 Izmir',
    phone: '+90 232 555 07 89',
    email: 'izmir@estateview.com',
    hours: 'Mon–Fri 09:00–17:30',
  },
];

const SUBJECTS = [
  'I want to buy a property',
  'I want to sell a property',
  'I want to rent a property',
  'I want to list my property',
  'Question about an agent',
  'Technical / website issue',
  'Partnership inquiry',
  'Other',
];

const FAQS = [
  {
    q: 'How do I list my property on EstateView?',
    a: 'Click "List Property" in the nav, fill in the details, and one of our agents will review and publish your listing within 24 hours.',
  },
  {
    q: 'Are all listings verified?',
    a: 'Yes — every listing goes through a manual verification step by our in-house team before it goes live on the platform.',
  },
  {
    q: 'Is there a fee to search or contact agents?',
    a: 'Searching and contacting agents is completely free for buyers and renters. Sellers and landlords pay only on successful completion.',
  },
  {
    q: 'How quickly will an agent get back to me?',
    a: 'Our agents typically respond within 2–4 hours on business days. Urgent enquiries can be directed to our main phone line.',
  },
  {
    q: 'Can I use EstateView as a foreign buyer?',
    a: 'Absolutely. Several of our agents are multilingual and have extensive experience helping international buyers navigate Turkish property law.',
  },
];

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="bg-surface-base text-text-primary">
      <DocumentTitle text={`Contact — ${THEME_TITLES['real-estate']}`} />

      {/* ── Hero ── */}
      <section className="border-b border-border bg-surface-raised">
        <div className="mx-auto max-w-7xl px-6 py-14 text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-subtle text-primary mb-4 mx-auto">
            <FontAwesomeIcon icon={faEnvelope} className="w-7 h-7" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold text-text-primary">Get in Touch</h1>
          <p className="text-text-secondary mt-2 text-sm max-w-md mx-auto leading-relaxed">
            Have a question, want to list a property, or need expert advice? Our team is here to help.
          </p>
        </div>
      </section>

      {/* ── Form + sidebar ── */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-10">

          {/* Form */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-text-primary mb-6">Send us a message</h2>

            {sent ? (
              <div className="flex flex-col items-center text-center rounded-2xl border border-border bg-surface-raised p-12 space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success-subtle text-success">
                  <FontAwesomeIcon icon={faCheckCircle} className="w-8 h-8" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-text-primary">Message Received!</h3>
                <p className="text-text-secondary text-sm max-w-xs leading-relaxed">
                  Thank you for reaching out. A member of our team will get back to you within one business day.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSent(false);
                    setName('');
                    setEmail('');
                    setPhone('');
                    setSubject('');
                    setMessage('');
                  }}
                >
                  Send another message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-border bg-surface-raised p-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="c-name" className="block text-xs font-semibold text-text-secondary mb-1.5">
                      Full Name <span className="text-error">*</span>
                    </label>
                    <input
                      id="c-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full px-3 py-2.5 rounded-lg border border-border bg-surface-base text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-border-focus transition"
                    />
                  </div>
                  <div>
                    <label htmlFor="c-email" className="block text-xs font-semibold text-text-secondary mb-1.5">
                      Email Address <span className="text-error">*</span>
                    </label>
                    <input
                      id="c-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-3 py-2.5 rounded-lg border border-border bg-surface-base text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-border-focus transition"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="c-phone" className="block text-xs font-semibold text-text-secondary mb-1.5">
                      Phone <span className="text-text-disabled">(optional)</span>
                    </label>
                    <input
                      id="c-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+90 5XX XXX XX XX"
                      className="w-full px-3 py-2.5 rounded-lg border border-border bg-surface-base text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-border-focus transition"
                    />
                  </div>
                  <div>
                    <label htmlFor="c-subject" className="block text-xs font-semibold text-text-secondary mb-1.5">
                      Subject <span className="text-error">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="c-subject"
                        required
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg border border-border bg-surface-base text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-border-focus transition appearance-none"
                      >
                        <option value="" disabled>Select a topic…</option>
                        {SUBJECTS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <FontAwesomeIcon
                        icon={faChevronDown}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-secondary pointer-events-none"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="c-message" className="block text-xs font-semibold text-text-secondary mb-1.5">
                    Message <span className="text-error">*</span>
                  </label>
                  <textarea
                    id="c-message"
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we help you?"
                    className="w-full px-3 py-2.5 rounded-lg border border-border bg-surface-base text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-border-focus transition resize-none"
                  />
                </div>

                <Button variant="primary" type="submit" size="md">
                  <FontAwesomeIcon icon={faPaperPlane} className="w-4 h-4 mr-2" aria-hidden="true" />
                  Send Message
                </Button>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-text-primary mb-4">Our Offices</h2>
              <div className="space-y-4">
                {OFFICES.map((office) => (
                  <div key={office.city} className="rounded-xl border border-border bg-surface-raised p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-subtle text-primary shrink-0">
                        <FontAwesomeIcon icon={faBuilding} className="w-4 h-4" aria-hidden="true" />
                      </div>
                      <h3 className="text-sm font-bold text-text-primary">{office.city}</h3>
                    </div>
                    <div className="space-y-1.5 text-xs text-text-secondary">
                      <div className="flex gap-2">
                        <FontAwesomeIcon
                          icon={faLocationDot}
                          className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <span className="leading-relaxed">{office.address}</span>
                      </div>
                      <div className="flex gap-2 items-center">
                        <FontAwesomeIcon icon={faPhone} className="w-3.5 h-3.5 text-primary shrink-0" aria-hidden="true" />
                        <a
                          href={`tel:${office.phone.replace(/\s/g, '')}`}
                          className="hover:text-text-primary transition-colors"
                        >
                          {office.phone}
                        </a>
                      </div>
                      <div className="flex gap-2 items-center">
                        <FontAwesomeIcon icon={faEnvelope} className="w-3.5 h-3.5 text-primary shrink-0" aria-hidden="true" />
                        <a
                          href={`mailto:${office.email}`}
                          className="hover:text-text-primary transition-colors truncate"
                        >
                          {office.email}
                        </a>
                      </div>
                      <div className="flex gap-2 items-center">
                        <FontAwesomeIcon icon={faClock} className="w-3.5 h-3.5 text-primary shrink-0" aria-hidden="true" />
                        <span>{office.hours}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* General contact */}
            <div className="rounded-xl border border-border bg-primary-subtle p-4 space-y-2.5">
              <p className="text-xs font-semibold text-primary uppercase tracking-wide">General Enquiries</p>
              <a
                href="tel:+908501234567"
                className="flex items-center gap-2 text-sm font-medium text-text-primary hover:text-primary transition-colors"
              >
                <FontAwesomeIcon icon={faPhone} className="w-4 h-4 text-primary" aria-hidden="true" />
                +90 850 123 45 67
              </a>
              <a
                href="mailto:info@estateview.com"
                className="flex items-center gap-2 text-sm font-medium text-text-primary hover:text-primary transition-colors"
              >
                <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4 text-primary" aria-hidden="true" />
                info@estateview.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── FAQ ── */}
      <section className="bg-surface-raised border-t border-border">
        <div className="mx-auto max-w-3xl px-6 py-14">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-text-primary">Frequently Asked Questions</h2>
            <p className="text-text-secondary mt-2 text-sm">Quick answers to the questions we hear most</p>
          </div>
          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <div key={i} className="rounded-xl border border-border bg-surface-base overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                  aria-expanded={openFaq === i}
                >
                  <span className="text-sm font-semibold text-text-primary">{faq.q}</span>
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className={cn(
                      'w-4 h-4 text-text-secondary transition-transform shrink-0 ml-4',
                      openFaq === i && 'rotate-180'
                    )}
                    aria-hidden="true"
                  />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-sm text-text-secondary leading-relaxed border-t border-border pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
