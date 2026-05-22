import type { Metadata } from 'next';
import { buildPageTitle, THEME_TITLES } from '@/libs/config/showcase.config';
import { Breadcrumb } from '@/modules/ui/Breadcrumb';
import { Badge } from '@/modules/ui/Badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMagnifyingGlass,
  faArrowRight,
  faArrowTrendUp,
  faLocationDot,
  faChevronRight,
  faCircleInfo,
} from '@fortawesome/free-solid-svg-icons';

export const metadata: Metadata = {
  title: buildPageTitle('Salaries', THEME_TITLES['jobs']),
};

type SalaryRow = {
  title: string;
  category: string;
  level: 'Junior' | 'Mid' | 'Senior' | 'Lead';
  min: number;
  median: number;
  max: number;
  yoy: number;
  jobCount: number;
};

const SALARY_DATA: SalaryRow[] = [
  { title: 'Frontend Engineer',         category: 'Engineering', level: 'Senior', min: 130000, median: 175000, max: 230000, yoy: 8,  jobCount: 1240 },
  { title: 'Backend Engineer',          category: 'Engineering', level: 'Senior', min: 140000, median: 185000, max: 245000, yoy: 7,  jobCount: 1480 },
  { title: 'Full Stack Engineer',       category: 'Engineering', level: 'Mid',    min: 110000, median: 145000, max: 195000, yoy: 11, jobCount: 2100 },
  { title: 'DevOps / SRE',             category: 'Engineering', level: 'Senior', min: 145000, median: 195000, max: 260000, yoy: 12, jobCount: 620  },
  { title: 'Machine Learning Engineer', category: 'Data',        level: 'Senior', min: 170000, median: 225000, max: 310000, yoy: 15, jobCount: 430  },
  { title: 'Data Scientist',            category: 'Data',        level: 'Mid',    min: 110000, median: 155000, max: 210000, yoy: 9,  jobCount: 780  },
  { title: 'Data Analyst',             category: 'Data',        level: 'Junior', min: 70000,  median: 95000,  max: 125000, yoy: 6,  jobCount: 1100 },
  { title: 'Product Manager',          category: 'Product',     level: 'Senior', min: 135000, median: 175000, max: 235000, yoy: 5,  jobCount: 540  },
  { title: 'Product Designer',         category: 'Design',      level: 'Mid',    min: 100000, median: 140000, max: 185000, yoy: 7,  jobCount: 390  },
  { title: 'UX Researcher',            category: 'Design',      level: 'Mid',    min: 90000,  median: 120000, max: 160000, yoy: 4,  jobCount: 210  },
  { title: 'Engineering Manager',      category: 'Engineering', level: 'Lead',   min: 190000, median: 240000, max: 320000, yoy: 10, jobCount: 280  },
  { title: 'Head of Growth',           category: 'Marketing',   level: 'Lead',   min: 155000, median: 195000, max: 260000, yoy: 14, jobCount: 120  },
];

const LEVELS = ['All', 'Junior', 'Mid', 'Senior', 'Lead'] as const;
const CATEGORIES = ['All', 'Engineering', 'Data', 'Product', 'Design', 'Marketing'];
const LOCATIONS = ['Remote (US)', 'San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA'];

function fmt(n: number) {
  return `$${(n / 1000).toFixed(0)}k`;
}

function BarRange({ min, median, max }: { min: number; median: number; max: number }) {
  const total = 350000;
  const leftPct  = (min / total)    * 100;
  const widthPct = ((max - min) / total) * 100;
  const medPct   = (median / total) * 100;

  return (
    <div className="relative h-2 bg-surface-sunken rounded-full my-1 w-full">
      <div
        className="absolute h-full rounded-full bg-primary/30"
        style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
      />
      <div
        className="absolute h-4 w-1 bg-primary rounded-full top-1/2 -translate-y-1/2"
        style={{ left: `${medPct}%` }}
        aria-label={`Median: ${fmt(median)}`}
      />
    </div>
  );
}

export default function SalariesPage() {
  return (
    <div className="bg-surface-base text-text-primary">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-border bg-surface-raised">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(55%_55%_at_80%_-10%,_var(--primary-subtle),_transparent_70%)]" />
        </div>
        <div className="mx-auto max-w-7xl px-6 py-10">
          <Breadcrumb items={[{ label: 'Home', href: '/theme/jobs' }, { label: 'Salaries' }]} />

          <div className="mt-6 space-y-2 max-w-2xl">
            <h1 className="text-3xl font-bold text-text-primary">Salary Explorer</h1>
            <p className="text-text-secondary">
              Real compensation data from thousands of verified job postings. Search by role, location, and experience level.
            </p>
          </div>

          {/* Search */}
          <div className="mt-7 flex flex-col sm:flex-row gap-3 max-w-2xl">
            <div className="flex items-stretch flex-1 rounded-xl border border-border bg-surface-base overflow-hidden focus-within:ring-2 focus-within:ring-border-focus">
              <div className="flex items-center gap-2 flex-1 px-3">
                <FontAwesomeIcon icon={faMagnifyingGlass} className="w-4 h-4 text-text-secondary shrink-0" aria-hidden="true" />
                <input
                  type="search"
                  placeholder="Job title or skill…"
                  className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-secondary outline-none py-2.5"
                />
              </div>
              <div className="w-px bg-border self-stretch my-2" aria-hidden="true" />
              <div className="flex items-center gap-2 w-40 px-3">
                <FontAwesomeIcon icon={faLocationDot} className="w-4 h-4 text-text-secondary shrink-0" aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Location"
                  className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-secondary outline-none py-2.5 min-w-0"
                />
              </div>
              <button className="px-5 bg-primary text-primary-fg text-sm font-semibold hover:bg-primary-hover transition-colors">
                Search
              </button>
            </div>
          </div>

          {/* Quick chips */}
          <div className="mt-4 flex flex-wrap gap-2">
            {['Frontend Engineer', 'Product Manager', 'ML Engineer', 'DevOps', 'Data Scientist'].map((title) => (
              <button
                key={title}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-border bg-surface-base text-text-secondary hover:border-primary hover:text-primary transition-colors"
              >
                {title}
                <FontAwesomeIcon icon={faChevronRight} className="w-2.5 h-2.5" aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Highlights ── */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              label: 'Highest paying role',
              role: 'Engineering Manager',
              value: '$240k median',
              yoy: '+10% YoY',
              color: 'bg-success-subtle border-success/30 text-success-fg',
              badge: 'success' as const,
            },
            {
              label: 'Fastest growing',
              role: 'ML Engineer',
              value: '$225k median',
              yoy: '+15% YoY',
              color: 'bg-primary-subtle border-primary/30 text-primary',
              badge: 'primary' as const,
            },
            {
              label: 'Most in-demand',
              role: 'Full Stack Engineer',
              value: '$145k median',
              yoy: '+11% YoY',
              color: 'bg-info-subtle border-info/30 text-info',
              badge: 'info' as const,
            },
          ].map((card) => (
            <div key={card.role} className={`rounded-xl border p-5 ${card.color}`}>
              <p className="text-xs font-semibold uppercase tracking-widest opacity-70">{card.label}</p>
              <p className="mt-2 text-lg font-bold">{card.role}</p>
              <p className="text-2xl font-extrabold mt-1">{card.value}</p>
              <div className="mt-2">
                <Badge variant={card.badge} size="sm">
                  <FontAwesomeIcon icon={faArrowTrendUp} className="w-3 h-3 mr-1" aria-hidden="true" />
                  {card.yoy}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Table ── */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block w-52 shrink-0 space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary mb-2">Experience Level</p>
              <ul className="space-y-1">
                {LEVELS.map((lvl) => (
                  <li key={lvl}>
                    <button className={`w-full text-left px-2 py-1.5 rounded-lg text-sm transition-colors ${lvl === 'All' ? 'bg-primary-subtle text-primary font-medium' : 'text-text-secondary hover:text-text-primary hover:bg-surface-overlay'}`}>
                      {lvl}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary mb-2">Category</p>
              <ul className="space-y-1">
                {CATEGORIES.map((cat) => (
                  <li key={cat}>
                    <button className={`w-full text-left px-2 py-1.5 rounded-lg text-sm transition-colors ${cat === 'All' ? 'bg-primary-subtle text-primary font-medium' : 'text-text-secondary hover:text-text-primary hover:bg-surface-overlay'}`}>
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary mb-2">Location</p>
              <ul className="space-y-1">
                {LOCATIONS.map((loc) => (
                  <li key={loc}>
                    <button className="w-full text-left px-2 py-1.5 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-surface-overlay transition-colors">
                      {loc}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Table */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <p className="text-sm text-text-secondary">
                <span className="font-medium text-text-primary">{SALARY_DATA.length}</span> roles · Showing all levels
              </p>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs text-text-secondary border border-border rounded-lg px-2.5 py-1.5">
                  <FontAwesomeIcon icon={faCircleInfo} className="w-3.5 h-3.5" aria-hidden="true" />
                  Data from verified job postings, May 2026
                </span>
                <select className="rounded-lg border border-border bg-surface-base text-sm text-text-primary px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-border-focus">
                  <option>Sort: Highest Median</option>
                  <option>Sort: Fastest Growing</option>
                  <option>Sort: Most Jobs</option>
                </select>
              </div>
            </div>

            {/* Table header */}
            <div className="rounded-t-xl border border-border overflow-hidden">
              <div className="hidden md:grid grid-cols-[2fr_1fr_3fr_1fr_1fr] gap-x-4 bg-surface-raised px-5 py-3 text-xs font-semibold uppercase tracking-widest text-text-secondary border-b border-border">
                <span>Role</span>
                <span>Level</span>
                <span>Salary Range (USD / year)</span>
                <span className="text-right">YoY</span>
                <span className="text-right">Jobs</span>
              </div>

              <ul className="divide-y divide-border bg-surface-base">
                {SALARY_DATA.map((row) => (
                  <li key={row.title} className="group px-5 py-4 hover:bg-surface-raised transition-colors">
                    {/* Mobile layout */}
                    <div className="md:hidden space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-text-primary">{row.title}</span>
                        <Badge variant="neutral" size="sm">{row.level}</Badge>
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-xs text-text-secondary mb-1">
                          <span>{fmt(row.min)}</span>
                          <span className="font-semibold text-text-primary">{fmt(row.median)} median</span>
                          <span>{fmt(row.max)}</span>
                        </div>
                        <BarRange min={row.min} median={row.median} max={row.max} />
                      </div>
                      <div className="flex items-center justify-between text-xs text-text-secondary">
                        <span>
                          <Badge variant="success" size="sm">
                            <FontAwesomeIcon icon={faArrowTrendUp} className="w-2.5 h-2.5 mr-1" aria-hidden="true" />
                            +{row.yoy}% YoY
                          </Badge>
                        </span>
                        <span>{row.jobCount.toLocaleString()} roles</span>
                      </div>
                    </div>

                    {/* Desktop layout */}
                    <div className="hidden md:grid grid-cols-[2fr_1fr_3fr_1fr_1fr] gap-x-4 items-center">
                      <div>
                        <p className="font-semibold text-text-primary group-hover:text-primary transition-colors flex items-center gap-1">
                          {row.title}
                          <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                        </p>
                        <p className="text-xs text-text-secondary mt-0.5">{row.category}</p>
                      </div>

                      <div>
                        <Badge
                          variant={row.level === 'Junior' ? 'success' : row.level === 'Mid' ? 'info' : row.level === 'Senior' ? 'primary' : 'warning'}
                          size="sm"
                        >
                          {row.level}
                        </Badge>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-text-secondary">
                          <span>{fmt(row.min)}</span>
                          <span className="font-medium text-text-primary">{fmt(row.median)} median</span>
                          <span>{fmt(row.max)}</span>
                        </div>
                        <BarRange min={row.min} median={row.median} max={row.max} />
                      </div>

                      <div className="text-right">
                        <Badge variant="success" size="sm">
                          <FontAwesomeIcon icon={faArrowTrendUp} className="w-2.5 h-2.5 mr-1" aria-hidden="true" />
                          +{row.yoy}%
                        </Badge>
                      </div>

                      <div className="text-right text-sm text-text-secondary font-medium">
                        {row.jobCount.toLocaleString()}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legend */}
            <div className="mt-4 flex items-center gap-4 text-xs text-text-secondary">
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-8 h-2 rounded-full bg-primary/30" />
                Salary range (10th–90th percentile)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-1 h-4 rounded-full bg-primary" />
                Median
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-border bg-surface-raised">
        <div className="mx-auto max-w-7xl px-6 py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-bold text-text-primary">Want to see roles at your target salary?</h2>
            <p className="text-text-secondary text-sm mt-1">Browse open positions filtered by compensation range.</p>
          </div>
          <a
            href="/theme/jobs/jobs"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-fg font-semibold text-sm hover:bg-primary-hover transition-colors shrink-0"
          >
            Browse Jobs
            <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
        </div>
      </section>
    </div>
  );
}
