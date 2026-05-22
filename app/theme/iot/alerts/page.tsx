'use client';
import { DataTable } from '@/modules/ui/DataTable';
import type { TableColumn } from '@/modules/ui/DataTable';
import { AlertSeverityBadge } from '@/modules/domains/iot/alert/AlertSeverityBadge';
import { Badge } from '@/modules/ui/Badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { ALERTS } from '../iot.data';
import type { Alert, AlertSeverity, AlertStatus } from '@/modules/domains/iot/types';
import { DocumentTitle } from '@/libs/utils/DocumentTitle';

type AlertRow = {
  alertId: string;
  severity: AlertSeverity;
  status: AlertStatus;
  title: string;
  message: string;
  deviceName: string;
  triggeredAt: string;
  acknowledgedAt: string;
  resolvedAt: string;
  [key: string]: unknown;
};

const statusVariant: Record<AlertStatus, 'warning' | 'neutral' | 'success'> = {
  OPEN:         'warning',
  ACKNOWLEDGED: 'neutral',
  RESOLVED:     'success',
};

function fmt(date: Date | null | undefined): string {
  if (!date) return '—';
  return new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(date));
}

function toRow(a: Alert): AlertRow {
  return {
    alertId: a.alertId,
    severity: a.severity,
    status: a.status,
    title: a.title,
    message: a.message,
    deviceName: a.deviceName,
    triggeredAt: fmt(a.createdAt),
    acknowledgedAt: fmt(a.acknowledgedAt),
    resolvedAt: fmt(a.resolvedAt),
  };
}

const columns: TableColumn<AlertRow>[] = [
  {
    key: 'severity',
    header: 'Severity',
    align: 'center',
    sortable: true,
    render: (row) => <AlertSeverityBadge severity={row.severity} size="sm" />,
  },
  {
    key: 'status',
    header: 'Status',
    align: 'center',
    sortable: true,
    render: (row) => (
      <Badge variant={statusVariant[row.status]} size="sm">
        {row.status.charAt(0) + row.status.slice(1).toLowerCase()}
      </Badge>
    ),
  },
  {
    key: 'title',
    header: 'Alert',
    sortable: true,
    render: (row) => (
      <div className="min-w-0">
        <p className="text-sm font-medium text-text-primary">{row.title}</p>
        <p className="text-xs text-text-secondary line-clamp-1 mt-0.5">{row.message}</p>
      </div>
    ),
  },
  {
    key: 'deviceName',
    header: 'Device',
    sortable: true,
    render: (row) => (
      <span className="text-text-secondary whitespace-nowrap">{row.deviceName}</span>
    ),
  },
  {
    key: 'triggeredAt',
    header: 'Triggered',
    sortable: true,
    render: (row) => (
      <span className="text-text-secondary whitespace-nowrap text-xs">{row.triggeredAt}</span>
    ),
  },
  {
    key: 'acknowledgedAt',
    header: 'Acknowledged',
    render: (row) => (
      <span className="text-text-secondary whitespace-nowrap text-xs">
        {row.acknowledgedAt === '—' ? <span className="opacity-40">—</span> : row.acknowledgedAt}
      </span>
    ),
  },
  {
    key: 'resolvedAt',
    header: 'Resolved',
    render: (row) => (
      <span className="text-text-secondary whitespace-nowrap text-xs">
        {row.resolvedAt === '—' ? <span className="opacity-40">—</span> : row.resolvedAt}
      </span>
    ),
  },
  {
    key: 'actions',
    header: 'Actions',
    align: 'right',
    render: (row) => (
      <a
        href={`/theme/iot/alerts/${row.alertId}`}
        className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface-base px-2.5 py-1 text-xs font-medium text-text-primary hover:bg-surface-overlay transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
        aria-label={`Open alert ${row.title}`}
      >
        <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="w-3 h-3 text-primary" aria-hidden="true" />
        Open
      </a>
    ),
  },
];

export default function AlertsPage() {
  const rows = ALERTS.map(toRow);
  const open = ALERTS.filter((a) => a.status === 'OPEN').length;
  const acked = ALERTS.filter((a) => a.status === 'ACKNOWLEDGED').length;
  const resolved = ALERTS.filter((a) => a.status === 'RESOLVED').length;

  return (
    <>
      <DocumentTitle text="Alerts — IoT Theme" />
      <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Alerts</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            {open} open · {acked} acknowledged · {resolved} resolved
          </p>
        </div>

        <DataTable
          columns={columns}
          rows={rows}
          searchPlaceholder="Search alerts…"
          pageSize={10}
          emptyMessage="No alerts found."
          caption="Alerts"
        />
      </div>
      </div>
    </>
  );
}
