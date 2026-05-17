import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faBriefcase, faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { ApplicationCard } from '@/modules/domains/jobs/application/ApplicationCard';
import { InterviewScheduleRow, type InterviewMode } from '@/modules/domains/jobs/application/InterviewScheduleRow';
import type { ApplicationStatus } from '@/modules/domains/jobs/types';
import { JOBS } from '../jobs.data';

type Application = {
  applicationId: string;
  jobId: string;
  appliedAt: string;
  status: ApplicationStatus;
  nextStep?: string;
};

const APPLICATIONS: Application[] = [
  {
    applicationId: 'app-01',
    jobId: 'j-01',
    appliedAt: new Date(Date.now() - 2 * 86_400_000).toISOString(),
    status: 'INTERVIEW',
    nextStep: 'Technical interview · Thursday 10:00',
  },
  {
    applicationId: 'app-02',
    jobId: 'j-03',
    appliedAt: new Date(Date.now() - 5 * 86_400_000).toISOString(),
    status: 'REVIEWING',
    nextStep: 'Recruiter screening soon',
  },
  {
    applicationId: 'app-03',
    jobId: 'j-04',
    appliedAt: new Date(Date.now() - 9 * 86_400_000).toISOString(),
    status: 'PENDING',
  },
  {
    applicationId: 'app-04',
    jobId: 'j-05',
    appliedAt: new Date(Date.now() - 14 * 86_400_000).toISOString(),
    status: 'OFFERED',
    nextStep: 'Decide by Friday',
  },
  {
    applicationId: 'app-05',
    jobId: 'j-06',
    appliedAt: new Date(Date.now() - 21 * 86_400_000).toISOString(),
    status: 'REJECTED',
  },
];

type InterviewBooking = {
  id: string;
  round: string;
  companyName: string;
  jobTitle: string;
  mode: InterviewMode;
  scheduledAt: string;
  durationMin: number;
  interviewer?: string;
  meetingLink?: string;
};

const INTERVIEWS: InterviewBooking[] = [
  {
    id: 'iv-01',
    round: 'Technical interview',
    companyName: JOBS[0]?.company.name ?? 'Acme Corp',
    jobTitle: JOBS[0]?.title ?? 'Senior Engineer',
    mode: 'video',
    scheduledAt: new Date(Date.now() + 2 * 86_400_000 + 4 * 3600_000).toISOString(),
    durationMin: 60,
    interviewer: 'Dilek Karaca, Eng. Manager',
    meetingLink: '#',
  },
  {
    id: 'iv-02',
    round: 'Recruiter screen',
    companyName: JOBS[2]?.company.name ?? 'Northstar Studios',
    jobTitle: JOBS[2]?.title ?? 'Product Designer',
    mode: 'phone',
    scheduledAt: new Date(Date.now() + 5 * 86_400_000 + 9 * 3600_000).toISOString(),
    durationMin: 30,
  },
  {
    id: 'iv-03',
    round: 'On-site loop',
    companyName: JOBS[4]?.company.name ?? 'BlueOak Bank',
    jobTitle: JOBS[4]?.title ?? 'Staff Engineer',
    mode: 'onsite',
    scheduledAt: new Date(Date.now() - 3 * 86_400_000).toISOString(),
    durationMin: 240,
    interviewer: 'Multiple panels',
  },
];

export default function JobApplicationsPage() {
  const rows = APPLICATIONS.map((app) => {
    const job = JOBS.find((j) => j.jobId === app.jobId);
    return { app, job };
  }).filter((r): r is { app: Application; job: NonNullable<typeof r.job> } => Boolean(r.job));

  const statusCounts = APPLICATIONS.reduce((acc, a) => {
    acc[a.status] = (acc[a.status] ?? 0) + 1;
    return acc;
  }, {} as Record<ApplicationStatus, number>);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <a
        href="/theme/jobs"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary mb-4 transition-colors"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-3" aria-hidden="true" />
        Back home
      </a>

      <header className="mb-8">
        <p className="text-xs uppercase tracking-wide font-medium text-text-secondary">My account</p>
        <h1 className="text-2xl font-bold text-text-primary inline-flex items-center gap-2">
          <FontAwesomeIcon icon={faBriefcase} className="w-5 h-5 text-text-secondary" aria-hidden="true" />
          Applications
        </h1>
        <p className="mt-1 text-sm text-text-secondary tabular-nums">
          {APPLICATIONS.length} total ·{' '}
          <span className="text-primary font-semibold">{statusCounts.INTERVIEW ?? 0} interview</span> ·{' '}
          <span className="text-success font-semibold">{statusCounts.OFFERED ?? 0} offer</span>
        </p>
      </header>

      <section aria-label="Upcoming interviews" className="mb-10">
        <header className="mb-3 flex items-center gap-2">
          <FontAwesomeIcon icon={faCalendarDays} className="w-3.5 h-3.5 text-text-secondary" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wide">Scheduled</h2>
        </header>
        <div className="flex flex-col gap-2">
          {INTERVIEWS.map((iv) => (
            <InterviewScheduleRow
              key={iv.id}
              round={iv.round}
              companyName={iv.companyName}
              jobTitle={iv.jobTitle}
              mode={iv.mode}
              scheduledAt={iv.scheduledAt}
              durationMin={iv.durationMin}
              interviewer={iv.interviewer}
              meetingLink={iv.meetingLink}
            />
          ))}
        </div>
      </section>

      <section aria-label="All applications">
        <header className="mb-3">
          <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wide">All applications</h2>
        </header>
        <div className="flex flex-col gap-3">
          {rows.map(({ app, job }) => (
            <ApplicationCard
              key={app.applicationId}
              jobTitle={job.title}
              companyName={job.company.name}
              companyLogo={job.company.logo}
              location={job.location ?? undefined}
              salaryRange={
                job.salaryMin && job.salaryMax
                  ? `${(job.salaryMin / 1000).toFixed(0)}–${(job.salaryMax / 1000).toFixed(0)}k ${job.currency ?? 'USD'}`
                  : undefined
              }
              appliedAt={app.appliedAt}
              status={app.status}
              nextStep={app.nextStep}
              href={`/theme/jobs/jobs/${job.slug}`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
