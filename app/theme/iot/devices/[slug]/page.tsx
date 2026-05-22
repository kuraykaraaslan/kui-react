import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLocationDot,
  faClock,
  faMicrochip,
  faCircleNodes,
  faCodeBranch,
  faTag,
  faArrowLeft,
  faChartLine,
} from '@fortawesome/free-solid-svg-icons';
import { DeviceStatusBadge } from '@/modules/domains/iot/device/DeviceStatusBadge';
import { DeviceTypeBadge } from '@/modules/domains/iot/device/DeviceTypeBadge';
import { AlertSeverityBadge } from '@/modules/domains/iot/alert/AlertSeverityBadge';
import { DEVICES, TELEMETRY_READINGS, ALERTS } from '../../iot.data';
import { buildPageTitle, THEME_TITLES } from '@/libs/config/showcase.config';

export async function generateStaticParams() {
  return DEVICES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const device = DEVICES.find((d) => d.slug === slug);
  return { title: buildPageTitle(device?.name ?? slug, THEME_TITLES.iot) };
}

function formatDateTime(date: Date | null | undefined) {
  if (!date) return 'Never';
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'medium',
  }).format(new Date(date));
}

export default async function DeviceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const device = DEVICES.find((d) => d.slug === slug);
  if (!device) notFound();

  const readings = TELEMETRY_READINGS.filter((t) => t.deviceId === device.deviceId).slice(0, 5);
  const deviceAlerts = ALERTS.filter((a) => a.deviceId === device.deviceId);
  const roleIcon = device.role === 'GATEWAY' ? faCircleNodes : faMicrochip;

  return (
    <div className="p-6 space-y-6">
      {/* Back */}
      <a
        href="/theme/iot/devices"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="w-3.5 h-3.5" aria-hidden="true" />
        Devices
      </a>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-subtle text-primary">
            <FontAwesomeIcon icon={roleIcon} className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary">{device.name}</h1>
            <p className="text-sm text-text-secondary font-mono">{device.deviceId}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={`/theme/iot/devices/${device.slug}/metrics`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-base px-3 py-1.5 text-sm font-medium text-text-primary hover:bg-surface-overlay transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
          >
            <FontAwesomeIcon icon={faChartLine} className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
            View metrics
          </a>
          <DeviceStatusBadge status={device.status} size="md" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Device info */}
        <section className="lg:col-span-1 rounded-xl border border-border bg-surface-base p-5 space-y-4">
          <h2 className="text-sm font-semibold text-text-primary">Device Info</h2>
          <dl className="space-y-3 text-sm">
            {[
              { label: 'Type',     icon: faTag,        value: <DeviceTypeBadge type={device.type} size="sm" /> },
              { label: 'Role',     icon: roleIcon,     value: device.role },
              { label: 'Model',    icon: faMicrochip,  value: device.model ?? '—' },
              { label: 'Firmware', icon: faCodeBranch, value: <span className="font-mono">{device.firmware ?? '—'}</span> },
              { label: 'Location', icon: faLocationDot, value: device.location?.label ?? '—' },
              { label: 'Last Seen', icon: faClock,     value: formatDateTime(device.lastSeenAt) },
            ].map(({ label, icon, value }) => (
              <div key={label} className="flex items-start gap-2">
                <FontAwesomeIcon icon={icon} className="w-4 h-4 text-text-secondary mt-0.5 shrink-0" aria-hidden="true" />
                <div className="min-w-0 flex-1 flex items-baseline justify-between gap-2">
                  <span className="text-text-secondary">{label}</span>
                  <span className="text-text-primary text-right">{value}</span>
                </div>
              </div>
            ))}
          </dl>
          {device.tags.length > 0 && (
            <div className="pt-3 border-t border-border">
              <p className="text-xs text-text-secondary mb-2">Tags</p>
              <div className="flex flex-wrap gap-1">
                {device.tags.map((tag) => (
                  <span key={tag} className="inline-flex rounded-full bg-surface-overlay px-2 py-0.5 text-xs text-text-secondary">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        <div className="lg:col-span-2 space-y-6">
          {/* Recent telemetry */}
          <section className="rounded-xl border border-border bg-surface-base overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-text-primary">Recent Telemetry</h2>
            </div>
            {readings.length === 0 ? (
              <p className="px-5 py-8 text-sm text-text-secondary text-center">No telemetry data available.</p>
            ) : (
              <div className="divide-y divide-border">
                {readings.map((reading) => (
                  <div key={reading.readingId} className="px-5 py-3">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-mono text-primary">{reading.topic}</span>
                      <span className="text-xs text-text-secondary">
                        {formatDateTime(reading.timestamp)}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {Object.entries(reading.payload).map(([key, val]) => (
                        <div key={key} className="rounded-lg bg-surface-raised px-3 py-1.5">
                          <p className="text-xs text-text-secondary">{key}</p>
                          <p className="text-sm font-semibold text-text-primary font-mono">{String(val)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Alerts */}
          <section className="rounded-xl border border-border bg-surface-base overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-text-primary">
                Alerts
                {deviceAlerts.length > 0 && (
                  <span className="ml-2 rounded-full bg-error px-1.5 py-0.5 text-xs text-white">
                    {deviceAlerts.length}
                  </span>
                )}
              </h2>
            </div>
            {deviceAlerts.length === 0 ? (
              <p className="px-5 py-8 text-sm text-text-secondary text-center">No alerts for this device.</p>
            ) : (
              <ul className="divide-y divide-border">
                {deviceAlerts.map((alert) => (
                  <li key={alert.alertId} className="px-5 py-3">
                    <div className="flex items-start gap-3">
                      <AlertSeverityBadge severity={alert.severity} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-text-primary">{alert.title}</p>
                        <p className="text-xs text-text-secondary mt-0.5">{alert.message}</p>
                      </div>
                      <span className="shrink-0 text-xs text-text-secondary capitalize">
                        {alert.status.toLowerCase()}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
