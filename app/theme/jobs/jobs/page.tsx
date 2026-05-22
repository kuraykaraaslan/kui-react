import type { Metadata } from 'next';
import { buildPageTitle, THEME_TITLES } from '@/libs/config/showcase.config';
import { Badge } from '@/modules/ui/Badge';
import { Button } from '@/modules/ui/Button';
import { Breadcrumb } from '@/modules/ui/Breadcrumb';
import { JobCard } from '@/modules/domains/jobs/job/JobCard';
import { JobTypeBadge } from '@/modules/domains/jobs/job/JobTypeBadge';
import { JobWorkModeBadge } from '@/modules/domains/jobs/job/JobWorkModeBadge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faLocationDot, faSliders } from '@fortawesome/free-solid-svg-icons';
import { JOBS, JOB_CATEGORIES } from '../jobs.data';

export const metadata: Metadata = {
  title: buildPageTitle('Jobs', THEME_TITLES['jobs']),
};

const JOB_TYPES = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'FREELANCE', 'INTERNSHIP'] as const;
const WORK_MODES = ['REMOTE', 'HYBRID', 'ONSITE'] as const;

export default function JobsListingPage() {
  return (
    <div className="bg-surface-base text-text-primary">
      {/* Sub-header */}
      <div className="border-b border-border bg-surface-raised">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <Breadcrumb
            items={[
              { label: 'Home',   href: '/theme/jobs' },
              { label: 'Jobs' },
            ]}
          />
          <div className="mt-3 flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Browse Jobs</h1>
              <p className="text-sm text-text-secondary mt-0.5">{JOBS.length} roles available</p>
            </div>
            <Button variant="outline" size="sm" iconLeft={<FontAwesomeIcon icon={faSliders} className="w-3.5 h-3.5" />}>
              Filters
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex gap-8">
          {/* ── Sidebar filters ── */}
          <aside className="hidden lg:block w-64 shrink-0 space-y-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Search</label>
              <div className="relative">
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-secondary pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  placeholder="Title, skill, company…"
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-surface-base text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-border-focus"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Location</label>
              <div className="relative">
                <FontAwesomeIcon
                  icon={faLocationDot}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-secondary pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  placeholder="City, country, or Remote"
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-surface-base text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-border-focus"
                />
              </div>
            </div>

            {/* Job type */}
            <div>
              <p className="text-sm font-medium text-text-primary mb-2">Job Type</p>
              <div className="space-y-2">
                {JOB_TYPES.map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" className="rounded border-border text-primary focus:ring-border-focus w-4 h-4" />
                    <JobTypeBadge type={type} size="sm" />
                  </label>
                ))}
              </div>
            </div>

            {/* Work mode */}
            <div>
              <p className="text-sm font-medium text-text-primary mb-2">Work Mode</p>
              <div className="space-y-2">
                {WORK_MODES.map((mode) => (
                  <label key={mode} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-border text-primary focus:ring-border-focus w-4 h-4" />
                    <JobWorkModeBadge workMode={mode} size="sm" />
                  </label>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div>
              <p className="text-sm font-medium text-text-primary mb-2">Category</p>
              <div className="space-y-1">
                {JOB_CATEGORIES.map((cat) => {
                  const count = JOBS.filter((j) => j.categoryId === cat.categoryId).length;
                  return (
                    <label key={cat.categoryId} className="flex items-center justify-between gap-2 cursor-pointer px-2 py-1.5 rounded-lg hover:bg-surface-overlay text-sm text-text-secondary hover:text-text-primary transition-colors">
                      <span className="flex items-center gap-2">
                        <input type="checkbox" className="rounded border-border text-primary focus:ring-border-focus w-3.5 h-3.5" />
                        {cat.title}
                      </span>
                      <Badge variant="neutral" size="sm">{count}</Badge>
                    </label>
                  );
                })}
              </div>
            </div>

            <Button variant="outline" size="sm" fullWidth>Clear Filters</Button>
          </aside>

          {/* ── Job grid ── */}
          <div className="flex-1 min-w-0">
            {/* Sort bar */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-text-secondary">
                Showing <span className="font-medium text-text-primary">{JOBS.length}</span> jobs
              </p>
              <select className="rounded-lg border border-border bg-surface-base text-sm text-text-primary px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-border-focus">
                <option>Most Recent</option>
                <option>Salary (High to Low)</option>
                <option>Most Applied</option>
              </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {JOBS.map((job) => (
                <JobCard
                  key={job.jobId}
                  job={job}
                  href={`/theme/jobs/jobs/${job.slug}`}
                />
              ))}
            </div>

            {/* Pagination placeholder */}
            <div className="mt-8 flex justify-center gap-1">
              {[1, 2, 3].map((p) => (
                <button
                  key={p}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                    p === 1
                      ? 'bg-primary text-primary-fg'
                      : 'border border-border text-text-secondary hover:bg-surface-overlay'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
