import type { Metadata } from 'next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMicrochip,
  faCircleCheck,
  faCircleExclamation,
  faWrench,
  faBell,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import { AlertSeverityBadge } from '@/modules/domains/iot/alert/AlertSeverityBadge';
import { DeviceStatusBadge } from '@/modules/domains/iot/device/DeviceStatusBadge';
import { DEVICES, ALERTS, WORKSPACES } from './iot.data';
import { THEME_TITLES } from '@/libs/config/showcase.config';

export const metadata: Metadata = {
  title: { absolute: THEME_TITLES.iot },
};

const activeCloud = WORKSPACES[0];

const DEVICE_STATUS_COUNTS = {
  ONLINE:      DEVICES.filter((d) => d.status === 'ONLINE').length,
  OFFLINE:     DEVICES.filter((d) => d.status === 'OFFLINE').length,
  ERROR:       DEVICES.filter((d) => d.status === 'ERROR').length,
  MAINTENANCE: DEVICES.filter((d) => d.status === 'MAINTENANCE').length,
};

const OPEN_ALERTS = ALERTS.filter((a) => a.status === 'OPEN');

const STAT_CARDS = [
  {
    label: 'Total Devices',
    value: activeCloud.deviceCount,
    icon: faMicrochip,
    iconClass: 'text-primary',
    bg: 'bg-primary-subtle',
  },
  {
    label: 'Online',
    value: DEVICE_STATUS_COUNTS.ONLINE,
    icon: faCircleCheck,
    iconClass: 'text-success-fg',
    bg: 'bg-success-subtle',
  },
  {
    label: 'Errors',
    value: DEVICE_STATUS_COUNTS.ERROR,
    icon: faCircleExclamation,
    iconClass: 'text-error',
    bg: 'bg-error-subtle',
  },
  {
    label: 'Open Alerts',
    value: OPEN_ALERTS.length,
    icon: faBell,
    iconClass: 'text-warning',
    bg: 'bg-warning-subtle',
  },
];

function formatTime(date: Date | null | undefined) {
  if (!date) return '—';
  return new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date(date));
}

export default function IoTDashboardPage() {
  const recentDevices = DEVICES.slice(0, 5);
  const recentAlerts = OPEN_ALERTS.slice(0, 4);

  return (
    <div className="p-6 space-y-8 overflow-y-auto h-full">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Dashboard</h1>
          <p className="text-sm text-text-secondary mt-0.5">{activeCloud.name} · {activeCloud.region}</p>
        </div>
        <a
          href="/theme/iot/devices"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-fg hover:bg-primary-hover transition-colors"
        >
          All Devices
          <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5" aria-hidden="true" />
        </a>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STAT_CARDS.map((stat) => (
          <div key={stat.label} className="flex items-center gap-4 rounded-xl border border-border bg-surface-base p-4">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${stat.bg}`}>
              <FontAwesomeIcon icon={stat.icon} className={`w-5 h-5 ${stat.iconClass}`} aria-hidden="true" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
              <p className="text-xs text-text-secondary">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Device status table */}
        <section className="rounded-xl border border-border bg-surface-base overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-text-primary">Recent Devices</h2>
            <a href="/theme/iot/devices" className="text-xs text-primary hover:underline">
              View all
            </a>
          </div>
          <ul className="divide-y divide-border">
            {recentDevices.map((device) => (
              <li key={device.deviceId}>
                <a
                  href={`/theme/iot/devices/${device.slug}`}
                  className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-surface-overlay transition-colors"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-text-primary">{device.name}</p>
                    <p className="truncate text-xs text-text-secondary">{device.model ?? device.type}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="hidden sm:block text-xs text-text-secondary">
                      {formatTime(device.lastSeenAt)}
                    </span>
                    <DeviceStatusBadge status={device.status} size="sm" />
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* Open alerts */}
        <section className="rounded-xl border border-border bg-surface-base overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-text-primary">Open Alerts</h2>
            <a href="/theme/iot/alerts" className="text-xs text-primary hover:underline">
              View all
            </a>
          </div>
          {recentAlerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FontAwesomeIcon icon={faCircleCheck} className="w-8 h-8 text-success mb-3" aria-hidden="true" />
              <p className="text-sm font-medium text-text-primary">No open alerts</p>
              <p className="text-xs text-text-secondary mt-1">All systems operating normally</p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {recentAlerts.map((alert) => (
                <li key={alert.alertId} className="px-5 py-3 hover:bg-surface-overlay transition-colors">
                  <div className="flex items-start gap-3">
                    <AlertSeverityBadge severity={alert.severity} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-text-primary">{alert.title}</p>
                      <p className="text-xs text-text-secondary mt-0.5 line-clamp-1">{alert.message}</p>
                      <p className="text-xs text-text-secondary mt-1">{alert.deviceName}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Device status breakdown */}
      <section className="rounded-xl border border-border bg-surface-base p-5">
        <h2 className="text-sm font-semibold text-text-primary mb-4">Fleet Status</h2>
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 h-3 rounded-full overflow-hidden bg-surface-sunken flex">
            {([
              { status: 'ONLINE',      count: DEVICE_STATUS_COUNTS.ONLINE,      class: 'bg-success' },
              { status: 'MAINTENANCE', count: DEVICE_STATUS_COUNTS.MAINTENANCE, class: 'bg-warning' },
              { status: 'ERROR',       count: DEVICE_STATUS_COUNTS.ERROR,       class: 'bg-error' },
              { status: 'OFFLINE',     count: DEVICE_STATUS_COUNTS.OFFLINE,     class: 'bg-surface-sunken' },
            ] as const).map(({ status, count, class: cls }) => (
              count > 0 && (
                <div
                  key={status}
                  className={cls}
                  style={{ width: `${(count / activeCloud.deviceCount) * 100}%` }}
                  title={`${status}: ${count}`}
                />
              )
            ))}
          </div>
          <span className="text-xs text-text-secondary shrink-0">
            {activeCloud.onlineCount}/{activeCloud.deviceCount} online
          </span>
        </div>
        <div className="flex flex-wrap gap-4 text-xs text-text-secondary">
          {([
            { label: 'Online',      count: DEVICE_STATUS_COUNTS.ONLINE,      dotClass: 'bg-success' },
            { label: 'Offline',     count: DEVICE_STATUS_COUNTS.OFFLINE,     dotClass: 'bg-border-strong' },
            { label: 'Error',       count: DEVICE_STATUS_COUNTS.ERROR,       dotClass: 'bg-error' },
            { label: 'Maintenance', count: DEVICE_STATUS_COUNTS.MAINTENANCE, dotClass: 'bg-warning' },
          ] as const).map(({ label, count, dotClass }) => (
            <span key={label} className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${dotClass}`} />
              {label}: <strong className="text-text-primary">{count}</strong>
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
