import type { Metadata } from 'next';
import { buildPageTitle, THEME_TITLES } from '@/libs/config/showcase.config';
import { Breadcrumb } from '@/modules/ui/Breadcrumb';
import { Badge } from '@/modules/ui/Badge';
import { CompanyCard } from '@/modules/domains/jobs/company/CompanyCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMagnifyingGlass,
  faArrowRight,
  faCircleCheck,
  faBuilding,
  faUsers,
  faGlobe,
  faStar,
} from '@fortawesome/free-solid-svg-icons';
import { COMPANIES, JOBS } from '../jobs.data';

export const metadata: Metadata = {
  title: buildPageTitle('Companies', THEME_TITLES['jobs']),
};

const INDUSTRIES = ['All', 'Developer Tools', 'Fintech', 'SaaS', 'Database / Cloud', 'Design Tools'];
const SIZES = ['All', '1–50', '51–200', '201–500', '501–1000', '1000+'];

const SPOTLIGHTS = [
  {
    company: COMPANIES[0],
    headline: 'Remote-first. Ship fast. Build the future.',
    perks: ['Unlimited PTO', 'Home office stipend', 'Top-tier equity'],
    rating: 4.9,
  },
  {
    company: COMPANIES[1],
    headline: 'Global scale. Real impact. Brilliant team.',
    perks: ['Catered lunches', '401k match', 'Generous equity'],
    rating: 4.8,
  },
  {
    company: COMPANIES[2],
    headline: 'Small team. Big mission. Craft-obsessed.',
    perks: ['Async-first', '$3k equipment', 'Flexible hours'],
    rating: 4.7,
  },
];

export default function CompaniesPage() {
  return (
    <div className="bg-surface-base text-text-primary">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-border bg-surface-raised">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_70%_0%,_var(--primary-subtle),_transparent_70%)]" />
        </div>
        <div className="mx-auto max-w-7xl px-6 py-10">
          <Breadcrumb items={[{ label: 'Home', href: '/theme/jobs' }, { label: 'Companies' }]} />

          <div className="mt-6 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-text-primary">Top Companies Hiring Now</h1>
              <p className="text-text-secondary">
                Discover {COMPANIES.length} companies across {INDUSTRIES.length - 1} industries — and the teams behind them.
              </p>
            </div>

            {/* Company search */}
            <div className="flex items-stretch rounded-xl border border-border bg-surface-base overflow-hidden max-w-md w-full focus-within:ring-2 focus-within:ring-border-focus">
              <div className="flex items-center gap-2 flex-1 px-3">
                <FontAwesomeIcon icon={faMagnifyingGlass} className="w-4 h-4 text-text-secondary shrink-0" aria-hidden="true" />
                <input
                  type="search"
                  placeholder="Search company name or industry…"
                  className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-secondary outline-none py-2.5"
                />
              </div>
              <button className="px-4 bg-primary text-primary-fg text-sm font-semibold hover:bg-primary-hover transition-colors">
                Search
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 flex flex-wrap gap-6">
            {[
              { icon: faBuilding, value: `${COMPANIES.length}`, label: 'Companies' },
              { icon: faUsers,    value: '12,400+',              label: 'Open Roles' },
              { icon: faGlobe,    value: '40+',                  label: 'Countries' },
              { icon: faStar,     value: '4.8 / 5',              label: 'Avg. Rating' },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-subtle">
                  <FontAwesomeIcon icon={s.icon} className="w-4 h-4 text-primary" aria-hidden="true" />
                </span>
                <div>
                  <div className="text-lg font-bold text-text-primary leading-none">{s.value}</div>
                  <div className="text-xs text-text-secondary mt-0.5">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Spotlight ── */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-text-primary">Featured Employers</h2>
          <Badge variant="success" dot>Verified</Badge>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SPOTLIGHTS.map(({ company, headline, perks, rating }) => (
            <a
              key={company.companyId}
              href="/theme/jobs/companies"
              className="group relative flex flex-col gap-4 rounded-2xl border border-border bg-surface-raised p-5 hover:shadow-md hover:border-border-focus transition-all duration-200"
            >
              <div className="flex items-start gap-3">
                {/* Logo */}
                <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-surface-base overflow-hidden shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={company.logo ?? ''} alt={company.name} className="h-full w-full object-cover" />
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-text-primary">{company.name}</span>
                    {company.verified && (
                      <FontAwesomeIcon icon={faCircleCheck} className="w-3.5 h-3.5 text-primary shrink-0" aria-label="Verified" />
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <FontAwesomeIcon icon={faStar} className="w-3 h-3 text-warning" aria-hidden="true" />
                    <span className="text-xs text-text-secondary">{rating} · {company.industry}</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-text-secondary leading-relaxed">{headline}</p>

              <div className="flex flex-wrap gap-1.5">
                {perks.map((p) => (
                  <span key={p} className="px-2 py-0.5 rounded-full bg-primary-subtle text-primary text-xs font-medium">
                    {p}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <Badge variant="primary" size="sm">
                  {JOBS.filter((j) => j.companyId === company.companyId).length} open roles
                </Badge>
                <span className="flex items-center gap-1 text-xs font-medium text-primary group-hover:gap-2 transition-all">
                  View jobs
                  <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3" aria-hidden="true" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ── Browse all ── */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block w-56 shrink-0 space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary mb-2">Industry</p>
              <ul className="space-y-1">
                {INDUSTRIES.map((ind) => (
                  <li key={ind}>
                    <button
                      className={`w-full text-left px-2 py-1.5 rounded-lg text-sm transition-colors ${
                        ind === 'All'
                          ? 'bg-primary-subtle text-primary font-medium'
                          : 'text-text-secondary hover:text-text-primary hover:bg-surface-overlay'
                      }`}
                    >
                      {ind}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary mb-2">Company Size</p>
              <ul className="space-y-1">
                {SIZES.map((sz) => (
                  <li key={sz}>
                    <button
                      className={`w-full text-left px-2 py-1.5 rounded-lg text-sm transition-colors ${
                        sz === 'All'
                          ? 'bg-primary-subtle text-primary font-medium'
                          : 'text-text-secondary hover:text-text-primary hover:bg-surface-overlay'
                      }`}
                    >
                      {sz}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm text-text-primary cursor-pointer">
                <input type="checkbox" className="rounded border-border text-primary focus:ring-border-focus w-4 h-4" />
                Verified only
              </label>
              <label className="flex items-center gap-2 text-sm text-text-primary cursor-pointer mt-2">
                <input type="checkbox" className="rounded border-border text-primary focus:ring-border-focus w-4 h-4" />
                Actively hiring
              </label>
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-text-secondary">
                <span className="font-medium text-text-primary">{COMPANIES.length}</span> companies
              </p>
              <select className="rounded-lg border border-border bg-surface-base text-sm text-text-primary px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-border-focus">
                <option>Most Jobs</option>
                <option>Highest Rated</option>
                <option>Recently Added</option>
              </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {COMPANIES.map((company) => {
                const count = JOBS.filter((j) => j.companyId === company.companyId).length;
                return (
                  <CompanyCard
                    key={company.companyId}
                    company={company}
                    jobCount={count}
                    href="/theme/jobs/companies"
                  />
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
