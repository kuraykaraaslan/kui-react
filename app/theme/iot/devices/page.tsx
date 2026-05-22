'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { DataTable } from '@/modules/ui/DataTable';
import type { TableColumn } from '@/modules/ui/DataTable';
import { Badge } from '@/modules/ui/Badge';
import { Button } from '@/modules/ui/Button';
import { DeviceStatusBadge } from '@/modules/domains/iot/device/DeviceStatusBadge';
import { DeviceTypeBadge } from '@/modules/domains/iot/device/DeviceTypeBadge';
import { DEVICES } from '../iot.data';
import type { Device } from '@/modules/domains/iot/types';
import { DocumentTitle } from '@/libs/utils/DocumentTitle';

type DeviceRow = {
  deviceId: string;
  slug: string;
  name: string;
  status: Device['status'];
  type: Device['type'];
  role: Device['role'];
  model: string;
  firmware: string;
  location: string;
  tags: string[];
  lastSeen: string;
  [key: string]: unknown;
};

function formatRelative(date: Date | null | undefined): string {
  if (!date) return '—';
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (diff < 60)   return `${diff}s ago`;
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function toRow(d: Device): DeviceRow {
  return {
    deviceId: d.deviceId,
    slug: d.slug,
    name: d.name,
    status: d.status,
    type: d.type,
    role: d.role,
    model: d.model ?? '—',
    firmware: d.firmware ?? '—',
    location: d.location?.label ?? '—',
    tags: d.tags,
    lastSeen: formatRelative(d.lastSeenAt),
  };
}

const columns: TableColumn<DeviceRow>[] = [
  {
    key: 'status',
    header: 'Status',
    align: 'center',
    sortable: true,
    render: (row) => <DeviceStatusBadge status={row.status} size="sm" />,
  },
  {
    key: 'name',
    header: 'Name',
    sortable: true,
    render: (row) => (
      <a
        href={`/theme/iot/devices/${row.slug}`}
        className="font-medium text-text-primary hover:text-primary transition-colors"
      >
        {row.name}
      </a>
    ),
  },
  {
    key: 'type',
    header: 'Type',
    align: 'center',
    sortable: true,
    render: (row) => <DeviceTypeBadge type={row.type} size="sm" />,
  },
  {
    key: 'role',
    header: 'Role',
    align: 'center',
    sortable: true,
    render: (row) => (
      <Badge variant={row.role === 'GATEWAY' ? 'primary' : 'neutral'} size="sm">
        {row.role.charAt(0) + row.role.slice(1).toLowerCase()}
      </Badge>
    ),
  },
  {
    key: 'model',
    header: 'Model',
    sortable: true,
    render: (row) => <span className="text-text-secondary">{row.model}</span>,
  },
  {
    key: 'firmware',
    header: 'Firmware',
    render: (row) => (
      <span className="text-text-secondary font-mono text-xs">{row.firmware}</span>
    ),
  },
  {
    key: 'location',
    header: 'Location',
    render: (row) =>
      row.location === '—' ? (
        <span className="text-text-secondary italic opacity-50">—</span>
      ) : (
        <span className="flex items-center gap-1.5 text-text-secondary text-sm">
          <FontAwesomeIcon icon={faLocationDot} className="w-3 h-3 shrink-0" aria-hidden="true" />
          {row.location}
        </span>
      ),
  },
  {
    key: 'tags',
    header: 'Tags',
    render: (row) => (
      <div className="flex flex-wrap gap-1">
        {(row.tags as string[]).map((t) => (
          <Badge key={t} variant="neutral" size="sm">{t}</Badge>
        ))}
      </div>
    ),
  },
  {
    key: 'lastSeen',
    header: 'Last Seen',
    sortable: true,
    render: (row) => (
      <span className="text-text-secondary whitespace-nowrap">{row.lastSeen}</span>
    ),
  },
  {
    key: 'actions',
    header: '',
    align: 'right',
    render: (row) => (
      <Button
        as="a"
        href={`/theme/iot/devices/${row.slug}`}
        variant="ghost"
        size="xs"
        iconOnly
        aria-label="View device"
      >
        <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="w-3 h-3" aria-hidden="true" />
      </Button>
    ),
  },
];

export default function DevicesPage() {
  const rows = DEVICES.map(toRow);

  return (
    <>
      <DocumentTitle text="Devices — IoT Theme" />
      <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Devices</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            {DEVICES.length} devices across all workspaces
          </p>
        </div>

        <DataTable
          columns={columns}
          rows={rows}
          searchPlaceholder="Search devices…"
          pageSize={10}
          emptyMessage="No devices found."
          caption="Devices"
        />
      </div>
      </div>
    </>
  );
}
