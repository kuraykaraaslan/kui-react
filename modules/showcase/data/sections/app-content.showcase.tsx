'use client';
import { useState } from 'react';
import { DetailHeader } from '@/modules/app/DetailHeader';
import { ErrorState, NotFoundState } from '@/modules/app/EmptyErrorState';
import { LoadingState } from '@/modules/app/LoadingState';
import { SplashScreen } from '@/modules/app/SplashScreen';
import { MaintenancePage } from '@/modules/app/MaintenancePage';
import { Button } from '@/modules/ui/Button';
import type { ShowcaseComponent } from '../showcase.types';

function DetailHeaderBasicDemo() {
  return (
    <div className="w-full rounded-xl overflow-hidden border border-border">
      <DetailHeader
        title="Invoice #1042"
        subtitle="Created 3 days ago by Jane Doe"
        status="Pending"
        statusVariant="warning"
      >
        <Button variant="outline" size="sm">Edit</Button>
        <Button variant="primary" size="sm">Approve</Button>
      </DetailHeader>
    </div>
  );
}

function DetailHeaderTabsDemo() {
  return (
    <div className="w-full rounded-xl overflow-hidden border border-border">
      <DetailHeader
        title="Order #8821"
        subtitle="Last updated 2 hours ago"
        status="Shipped"
        statusVariant="success"
        tabs={[
          { value: 'overview', label: 'Overview' },
          { value: 'items',    label: 'Items'    },
          { value: 'history',  label: 'History'  },
          { value: 'notes',    label: 'Notes', disabled: true },
        ]}
        defaultTab="overview"
      >
        <Button variant="ghost" size="sm">Print</Button>
        <Button variant="primary" size="sm">Track</Button>
      </DetailHeader>
    </div>
  );
}

export function buildAppContentData(): ShowcaseComponent[] {
  return [
    {
      id: 'detail-header',
      title: 'DetailHeader',
      category: 'App',
      abbr: 'DH',
      description: 'Page header for detail/record views: title, subtitle, status badge, action buttons, and optional tab navigation.',
      filePath: 'modules/app/DetailHeader.tsx',
      sourceCode: `'use client';
import { DetailHeader } from '@/modules/app/DetailHeader';

<DetailHeader
  title="Invoice #1042"
  subtitle="Created 3 days ago"
  status="Pending"
  statusVariant="warning"
  tabs={[
    { value: 'overview', label: 'Overview' },
    { value: 'items',    label: 'Items'    },
  ]}
  defaultTab="overview"
>
  <Button variant="primary" size="sm">Approve</Button>
</DetailHeader>`,
      variants: [
        {
          title: 'With actions, no tabs',
          layout: 'stack' as const,
          preview: <DetailHeaderBasicDemo />,
          code: `<DetailHeader
  title="Invoice #1042"
  subtitle="Created 3 days ago by Jane Doe"
  status="Pending"
  statusVariant="warning"
>
  <Button variant="outline" size="sm">Edit</Button>
  <Button variant="primary" size="sm">Approve</Button>
</DetailHeader>`,
        },
        {
          title: 'With tabs',
          layout: 'stack' as const,
          preview: <DetailHeaderTabsDemo />,
          code: `<DetailHeader
  title="Order #8821"
  subtitle="Last updated 2 hours ago"
  status="Shipped"
  statusVariant="success"
  tabs={[
    { value: 'overview', label: 'Overview' },
    { value: 'items',    label: 'Items'    },
    { value: 'history',  label: 'History'  },
    { value: 'notes',    label: 'Notes', disabled: true },
  ]}
  defaultTab="overview"
>
  <Button variant="ghost" size="sm">Print</Button>
  <Button variant="primary" size="sm">Track</Button>
</DetailHeader>`,
        },
      ],
    },
    {
      id: 'error-state',
      title: 'ErrorState',
      category: 'App',
      abbr: 'Er',
      description: 'Error state pairing an inline alert banner with a centered empty state. Optional retry action.',
      filePath: 'modules/app/EmptyErrorState.tsx',
      sourceCode: `'use client';
import { ErrorState } from '@/modules/app/EmptyErrorState';

<ErrorState
  title="Something went wrong"
  message="Failed to load user data."
/>

// With retry action:
<ErrorState
  title="Database connection failed"
  message="Could not connect. Please try again."
  onRetry={handleRetry}
  retryLabel="Try again"
/>`,
      variants: [
        {
          title: 'Default',
          layout: 'stack' as const,
          preview: <ErrorStateDefaultDemo />,
          code: `<ErrorState
  title="Something went wrong"
  message="Failed to load user data. Please check your connection."
/>`,
        },
        {
          title: 'With retry',
          layout: 'stack' as const,
          preview: <ErrorStateRetryDemo />,
          code: `<ErrorState
  title="Database connection failed"
  message="Could not connect to the database. Please try again."
  onRetry={handleRetry}
  retryLabel="Try again"
/>`,
        },
      ],
    },
    {
      id: 'not-found-state',
      title: 'NotFoundState',
      category: 'App',
      abbr: 'Ns',
      description: 'Not-found / empty record state with optional go-back action.',
      filePath: 'modules/app/EmptyErrorState.tsx',
      sourceCode: `'use client';
import { NotFoundState } from '@/modules/app/EmptyErrorState';

<NotFoundState />

// With custom title + back button:
<NotFoundState
  title="User not found"
  description="This user account doesn't exist or may have been deleted."
  onGoBack={() => router.back()}
  goBackLabel="Back to users"
/>`,
      variants: [
        {
          title: 'Default',
          layout: 'stack' as const,
          preview: <NotFoundStateDefaultDemo />,
          code: `<NotFoundState />`,
        },
        {
          title: 'With back link',
          layout: 'stack' as const,
          preview: <NotFoundStateBackDemo />,
          code: `<NotFoundState
  title="User not found"
  description="This user account doesn't exist or may have been deleted."
  onGoBack={() => router.back()}
  goBackLabel="Back to users"
/>`,
        },
      ],
    },
    {
      id: 'loading-state',
      title: 'LoadingState',
      category: 'App',
      abbr: 'Lo',
      description: 'Skeleton loading animations. Variants: spinner / table / cards / list / detail / form.',
      filePath: 'modules/app/LoadingState.tsx',
      sourceCode: `'use client';
import { LoadingState } from '@/modules/app/LoadingState';

<LoadingState variant="spinner" />
<LoadingState variant="table"  rows={5} cols={4} />
<LoadingState variant="cards"  cards={3} />
<LoadingState variant="list"   rows={4} />
<LoadingState variant="form"   rows={3} />`,
      variants: [
        {
          title: 'Spinner',
          layout: 'stack' as const,
          preview: <LoadingStateSpinnerDemo />,
          code: `<LoadingState variant="spinner" />`,
        },
        {
          title: 'Table skeleton',
          layout: 'stack' as const,
          preview: <LoadingStateTableDemo />,
          code: `<LoadingState variant="table" rows={5} cols={4} />`,
        },
        {
          title: 'Cards skeleton',
          layout: 'stack' as const,
          preview: <LoadingStateCardsDemo />,
          code: `<LoadingState variant="cards" cards={3} />`,
        },
        {
          title: 'List skeleton',
          layout: 'stack' as const,
          preview: <LoadingStateListDemo />,
          code: `<LoadingState variant="list" rows={4} />`,
        },
        {
          title: 'Form skeleton',
          layout: 'stack' as const,
          preview: <LoadingStateFormDemo />,
          code: `<LoadingState variant="form" rows={3} />`,
        },
      ],
    },
    {
      id: 'splash-screen',
      title: 'SplashScreen',
      category: 'App',
      abbr: 'SS',
      description: 'Full-screen overlay shown during app initialisation. Accepts a logo slot, optional progress bar, and fades out when visible=false.',
      filePath: 'modules/app/SplashScreen.tsx',
      sourceCode: `'use client';
import { SplashScreen } from '@/modules/app/SplashScreen';

// Show on mount, hide once data is ready
<SplashScreen
  visible={isLoading}
  logo={<span className="text-4xl font-black text-primary">Acme</span>}
  message="Loading your workspace…"
  progress={progress}
/>`,
      variants: [
        {
          title: 'Logo + message + progress',
          layout: 'stack' as const,
          preview: <SplashProgressDemo />,
          code: `<SplashScreen
  visible={true}
  logo={<span className="text-4xl font-black text-primary">Acme</span>}
  message="Loading your workspace…"
  progress={65}
/>`,
        },
        {
          title: 'Spinner only (no logo)',
          preview: <SplashSpinnerDemo />,
          code: `<SplashScreen visible={true} message="Please wait…" />`,
        },
        {
          title: 'Interactive fade-out',
          layout: 'stack' as const,
          preview: <SplashInteractiveDemo />,
          code: `const [visible, setVisible] = useState(true);

<SplashScreen
  visible={visible}
  logo={<span className="text-4xl font-black text-primary">Acme</span>}
  message="Starting up…"
/>
<Button onClick={() => setVisible(false)}>Dismiss</Button>`,
        },
      ],
    },
    {
      id: 'maintenance-page',
      title: 'MaintenancePage',
      category: 'App',
      abbr: 'Mp',
      since: '2026-05',
      description: 'Full-page maintenance screen. Optional ETA countdown badge and external status-page link. Use for planned downtime or unplanned outages.',
      filePath: 'modules/app/MaintenancePage.tsx',
      sourceCode: `'use client';
import { MaintenancePage } from '@/modules/app/MaintenancePage';

<MaintenancePage
  title="System Maintenance"
  description="We're performing a short maintenance to improve service quality. We'll be back shortly."
  eta={new Date(Date.now() + 30 * 60 * 1000)}
  statusUrl="https://status.example.com"
/>`,
      variants: [
        {
          title: 'Plain (no ETA)',
          layout: 'stack' as const,
          preview: <MaintenancePagePlainDemo />,
          code: `<MaintenancePage
  title="System Maintenance"
  description="We're performing a short maintenance."
/>`,
        },
        {
          title: 'With ETA + status link',
          layout: 'stack' as const,
          preview: <MaintenancePageEtaDemo />,
          code: `<MaintenancePage
  title="System Maintenance"
  description="We're shipping new features."
  eta={new Date(Date.now() + 45 * 60 * 1000)}
  statusUrl="https://status.example.com"
  statusLabel="Status Page"
/>`,
        },
      ],
      composes: ['badge'],
      designTokens: ['--warning', '--primary', '--surface-base', '--text-primary', '--text-secondary'],
      a11y: {
        wcagLevel: 'AA',
        ariaPatterns: ['role="status"', 'aria-live="polite"'],
        notes: 'Screen reader announces the maintenance state via the live region; countdown updates without re-announcing.',
      },
    },
  ];
}

function MaintenancePagePlainDemo() {
  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-border bg-surface-base" style={{ height: 360 }}>
      <MaintenancePage
        title="System Maintenance"
        description="We're performing a short maintenance to improve service quality. We'll be back shortly."
        className="!min-h-0 absolute inset-0"
      />
    </div>
  );
}

function MaintenancePageEtaDemo() {
  const [eta] = useState(() => new Date(Date.now() + 45 * 60 * 1000));
  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-border bg-surface-base" style={{ height: 420 }}>
      <MaintenancePage
        title="System Maintenance"
        description="We're shipping new features. Estimated return time below."
        eta={eta}
        statusUrl="https://status.example.com"
        statusLabel="Status Page"
        className="!min-h-0 absolute inset-0"
      />
    </div>
  );
}

function ErrorStateDefaultDemo() {
  return (
    <div className="w-full max-w-lg p-4">
      <ErrorState
        title="Something went wrong"
        message="Failed to load user data. Please check your connection."
      />
    </div>
  );
}

function ErrorStateRetryDemo() {
  return (
    <div className="w-full max-w-lg p-4">
      <ErrorState
        title="Database connection failed"
        message="Could not connect to the database. Please try again."
        onRetry={() => {}}
        retryLabel="Try again"
      />
    </div>
  );
}

function NotFoundStateDefaultDemo() {
  return (
    <div className="w-full p-4">
      <NotFoundState />
    </div>
  );
}

function NotFoundStateBackDemo() {
  return (
    <div className="w-full p-4">
      <NotFoundState
        title="User not found"
        description="This user account doesn't exist or may have been deleted."
        onGoBack={() => {}}
        goBackLabel="Back to users"
      />
    </div>
  );
}

function LoadingStateSpinnerDemo() {
  return <LoadingState variant="spinner" />;
}

function LoadingStateTableDemo() {
  return (
    <div className="w-full p-4">
      <LoadingState variant="table" rows={5} cols={4} />
    </div>
  );
}

function LoadingStateCardsDemo() {
  return (
    <div className="w-full p-4">
      <LoadingState variant="cards" cards={3} />
    </div>
  );
}

function LoadingStateListDemo() {
  return (
    <div className="w-full max-w-lg p-4">
      <LoadingState variant="list" rows={4} />
    </div>
  );
}

function LoadingStateFormDemo() {
  return (
    <div className="w-full max-w-md p-4">
      <LoadingState variant="form" rows={3} />
    </div>
  );
}

function SplashProgressDemo() {
  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-border bg-surface-base" style={{ height: 280 }}>
      <SplashScreen
        visible
        logo={<span className="text-4xl font-black text-primary tracking-tight">Acme</span>}
        message="Loading your workspace…"
        progress={65}
        className="absolute"
      />
    </div>
  );
}

function SplashSpinnerDemo() {
  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-border bg-surface-base" style={{ height: 200 }}>
      <SplashScreen
        visible
        message="Please wait…"
        className="absolute"
      />
    </div>
  );
}

function SplashInteractiveDemo() {
  const [visible, setVisible] = useState(true);
  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-border bg-surface-base" style={{ height: 280 }}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-sm text-text-secondary">App content here</p>
          <Button variant="primary" size="sm" onClick={() => setVisible(true)}>Show splash</Button>
        </div>
      </div>
      <SplashScreen
        visible={visible}
        logo={<span className="text-4xl font-black text-primary tracking-tight">Acme</span>}
        message="Starting up…"
        className="absolute"
      />
      {visible && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
          <Button variant="outline" size="sm" onClick={() => setVisible(false)}>Dismiss</Button>
        </div>
      )}
    </div>
  );
}
