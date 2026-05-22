'use client';
import { DataTable } from '@/modules/ui/DataTable';
import type { TableColumn } from '@/modules/ui/DataTable';
import { Badge } from '@/modules/ui/Badge';
import { Button } from '@/modules/ui/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { WORKSPACES } from '../iot.data';
import type { CloudWorkspace, CloudStatus, CloudPlan } from '@/modules/domains/iot/types';
import { DocumentTitle } from '@/libs/utils/DocumentTitle';

type WorkspaceRow = {
  cloudId: string;
  slug: string;
  name: string;
  status: CloudStatus;
  plan: CloudPlan;
  deviceCount: number;
  onlineCount: number;
  onlinePct: string;
  memberCount: number;
  customDomain: string;
  region: string;
  createdAt: string;
  [key: string]: unknown;
};

const statusVariant: Record<CloudStatus, 'success' | 'warning' | 'neutral'> = {
  ACTIVE:    'success',
  SUSPENDED: 'warning',
  PENDING:   'neutral',
};

const planVariant: Record<CloudPlan, 'primary' | 'info' | 'neutral' | 'success'> = {
  FREE:         'neutral',
  STARTER:      'info',
  PROFESSIONAL: 'primary',
  ENTERPRISE:   'success',
};

function toRow(w: CloudWorkspace): WorkspaceRow {
  const pct = w.deviceCount > 0 ? Math.round((w.onlineCount / w.deviceCount) * 100) : 0;
  return {
    cloudId: w.cloudId,
    slug: w.slug,
    name: w.name,
    status: w.status,
    plan: w.plan,
    deviceCount: w.deviceCount,
    onlineCount: w.onlineCount,
    onlinePct: `${pct}%`,
    memberCount: w.memberCount,
    customDomain: w.customDomain ?? '—',
    region: w.region ?? '—',
    createdAt: w.createdAt
      ? new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' }).format(new Date(w.createdAt))
      : '—',
  };
}

const columns: TableColumn<WorkspaceRow>[] = [
  {
    key: 'status',
    header: 'Status',
    align: 'center',
    sortable: true,
    render: (row) => (
      <Badge variant={statusVariant[row.status]} size="sm" dot>
        {row.status.charAt(0) + row.status.slice(1).toLowerCase()}
      </Badge>
    ),
  },
  {
    key: 'name',
    header: 'Workspace',
    sortable: true,
    render: (row) => (
      <span className="font-medium text-text-primary">{row.name}</span>
    ),
  },
  {
    key: 'plan',
    header: 'Plan',
    align: 'center',
    sortable: true,
    render: (row) => (
      <Badge variant={planVariant[row.plan]} size="sm">
        {row.plan.charAt(0) + row.plan.slice(1).toLowerCase()}
      </Badge>
    ),
  },
  {
    key: 'onlineCount',
    header: 'Devices',
    align: 'center',
    sortable: true,
    render: (row) => (
      <div className="text-center">
        <span className="tabular-nums text-text-primary font-medium">{row.onlineCount}</span>
        <span className="text-text-secondary">/{row.deviceCount}</span>
        <span className="text-xs text-text-secondary ml-1">({row.onlinePct})</span>
      </div>
    ),
  },
  {
    key: 'memberCount',
    header: 'Members',
    align: 'center',
    sortable: true,
    render: (row) => (
      <span className="tabular-nums text-text-secondary">{row.memberCount}</span>
    ),
  },
  {
    key: 'region',
    header: 'Region',
    sortable: true,
    render: (row) => (
      <span className="text-text-secondary">{row.region}</span>
    ),
  },
  {
    key: 'customDomain',
    header: 'Custom Domain',
    render: (row) =>
      row.customDomain === '—' ? (
        <span className="text-text-secondary italic opacity-40">—</span>
      ) : (
        <span className="text-text-secondary font-mono text-xs">{row.customDomain}</span>
      ),
  },
  {
    key: 'createdAt',
    header: 'Created',
    sortable: true,
    render: (row) => (
      <span className="text-text-secondary whitespace-nowrap">{row.createdAt}</span>
    ),
  },
  {
    key: 'actions',
    header: '',
    align: 'right',
    render: (row) => (
      <Button
        as="a"
        href={`/theme/iot/workspaces/${row.slug}`}
        variant="ghost"
        size="xs"
        iconOnly
        aria-label="View workspace"
      >
        <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="w-3 h-3" aria-hidden="true" />
      </Button>
    ),
  },
];

export default function WorkspacesPage() {
  const rows = WORKSPACES.map(toRow);
  const totalDevices = WORKSPACES.reduce((s, w) => s + w.deviceCount, 0);

  return (
    <>
      <DocumentTitle text="Workspaces — IoT Theme" />
      <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Workspaces</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            {WORKSPACES.length} cloud workspaces · {totalDevices} total devices
          </p>
        </div>

        <DataTable
          columns={columns}
          rows={rows}
          searchPlaceholder="Search workspaces…"
          pageSize={10}
          emptyMessage="No workspaces found."
          caption="Cloud workspaces"
        />
      </div>
      </div>
    </>
  );
}
