'use client';
import { Button } from '@/modules/ui/Button';
import { AlertBanner } from '@/modules/ui/AlertBanner';
import { Toaster, toast, useToastStore } from '@/modules/ui/Toast';
import { EmptyState } from '@/modules/ui/EmptyState';
import { useState } from 'react';
import type { ShowcaseComponent } from '../showcase.types';

function ToastVariantsDemo() {
  const { clear } = useToastStore();
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="primary"   onClick={() => toast.success('Değişiklikler kaydedildi.')}>Success</Button>
        <Button size="sm" variant="outline"   onClick={() => toast.info('Yeni bir güncelleme mevcut.')}>Info</Button>
        <Button size="sm" variant="secondary" onClick={() => toast.warning('Oturum 5 dk sonra sona erecek.')}>Warning</Button>
        <Button size="sm" variant="danger"    onClick={() => toast.error('Kaydetme başarısız oldu.')}>Error</Button>
        <Button size="sm" variant="ghost"     onClick={clear}>Temizle</Button>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

function ToastTitleDemo() {
  const { clear } = useToastStore();
  return (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" variant="primary" onClick={() =>
        toast.success('Dosya yüklendi.', { title: 'Yükleme tamamlandı' })
      }>Title + Message</Button>
      <Button size="sm" variant="danger" onClick={() =>
        toast.error('Sunucuya bağlanılamadı. Ağ bağlantınızı kontrol edin.', { title: 'Bağlantı hatası' })
      }>Title + Error</Button>
      <Button size="sm" variant="ghost" onClick={clear}>Temizle</Button>
    </div>
  );
}

function ToastActionsDemo() {
  const { clear } = useToastStore();
  return (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" variant="outline" onClick={() =>
        toast.info('Öğe çöp kutusuna taşındı.', {
          title: 'Silindi',
          actions: [
            { label: 'Geri Al', onClick: (dismiss) => { alert('Geri alındı!'); dismiss(); } },
            { label: 'Kalıcı sil', onClick: (dismiss) => { alert('Kalıcı silindi'); dismiss(); }, variant: 'danger' },
          ],
        })
      }>İki action</Button>
      <Button size="sm" variant="outline" onClick={() =>
        toast.success('Rapor oluşturuldu.', {
          actions: [{ label: 'İndir', onClick: (dismiss) => { alert('İndiriliyor...'); dismiss(); } }],
        })
      }>Tek action</Button>
      <Button size="sm" variant="ghost" onClick={clear}>Temizle</Button>
    </div>
  );
}

function ToastLoadingDemo() {
  const { clear } = useToastStore();
  function firePromise() {
    toast.promise(
      new Promise<string>((res) => setTimeout(() => res('rapor.pdf'), 2500)),
      {
        loading: 'Rapor oluşturuluyor...',
        success: (file) => `${file} başarıyla oluşturuldu.`,
        error:   'Rapor oluşturulamadı.',
      },
    );
  }
  function fireError() {
    toast.promise(
      new Promise<void>((_, rej) => setTimeout(() => rej(new Error('Timeout')), 2000)),
      { loading: 'Veri gönderiliyor...', success: 'Gönderildi!', error: 'Gönderme başarısız oldu.' },
    );
  }
  return (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" variant="primary" onClick={firePromise}>promise() → success</Button>
      <Button size="sm" variant="danger"  onClick={fireError}>promise() → error</Button>
      <Button size="sm" variant="outline" onClick={() => toast.loading('İşleniyor...')}>loading()</Button>
      <Button size="sm" variant="ghost"   onClick={clear}>Temizle</Button>
    </div>
  );
}

// Dedicated demo for the post-M1 `toast.promise(p, { loading, success, error })`
// API. Single helper that fires a happy-path + an error-path promise so the
// loading → success / loading → error transitions are easy to compare.
function ToastPromiseApiDemo() {
  const { clear } = useToastStore();
  type User = { id: number; name: string };

  function fetchUser(): Promise<User> {
    return new Promise((res) => setTimeout(() => res({ id: 42, name: 'Ada Lovelace' }), 2000));
  }
  function fetchBroken(): Promise<User> {
    return new Promise((_, rej) => setTimeout(() => rej(new Error('500 Server Error')), 1800));
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" variant="primary" onClick={() =>
        toast.promise(fetchUser(), {
          loading: 'Kullanıcı yükleniyor...',
          success: (u) => `${u.name} (#${u.id}) yüklendi.`,
          error:   (e) => `Hata: ${(e as Error).message}`,
        })
      }>promise() happy path</Button>
      <Button size="sm" variant="danger" onClick={() =>
        toast.promise(fetchBroken(), {
          loading: 'İstek gönderiliyor...',
          success: 'Tamamlandı!',
          error:   (e) => `Başarısız: ${(e as Error).message}`,
        })
      }>promise() error path</Button>
      <Button size="sm" variant="ghost" onClick={clear}>Temizle</Button>
      <Toaster position="bottom-right" max={5} />
    </div>
  );
}

export function buildFeedbackData(): ShowcaseComponent[] {
  return [
    {
      id: 'alert-banner',
      title: 'AlertBanner',
      category: 'Organism',
      abbr: 'Ab',
      description: 'Page-level info, success, warning or error message. Announced via role="alert" for screen readers with optional dismissible and action support.',
      filePath: 'modules/ui/AlertBanner.tsx',
      sourceCode: `'use client';
import { cn } from '@/libs/utils/cn';
import { useState } from 'react';

const variantMap = {
  success: { container: 'bg-success-subtle border-success text-success-fg', icon: '✓' },
  warning: { container: 'bg-warning-subtle border-warning text-warning-fg', icon: '⚠' },
  error:   { container: 'bg-error-subtle border-error text-error-fg',       icon: '✕' },
  info:    { container: 'bg-info-subtle border-info text-info-fg',          icon: 'ℹ' },
};

export function AlertBanner({ variant = 'info', title, message, dismissible = false, className }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  const { container, icon } = variantMap[variant];
  return (
    <div role="alert" className={cn('flex items-start gap-3 rounded-lg border p-4', container, className)}>
      <span aria-hidden="true" className="mt-0.5 shrink-0 font-bold">{icon}</span>
      <div className="flex-1 text-sm">
        {title && <p className="font-semibold">{title}</p>}
        <p className={cn(title && 'mt-0.5')}>{message}</p>
      </div>
      {dismissible && (
        <button type="button" aria-label="Dismiss" onClick={() => setDismissed(true)} className="shrink-0 hover:opacity-70 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus rounded">✕</button>
      )}
    </div>
  );
}`,
      playground: {
        controls: [
          { key: 'variant',     label: 'Variant',     type: 'select',  options: ['info', 'success', 'warning', 'error'] as const, default: 'info' },
          { key: 'title',       label: 'Title',       type: 'text',    default: 'System update' },
          { key: 'message',     label: 'Message',     type: 'text',    default: 'A new version is available. Please refresh the page.' },
          { key: 'dismissible', label: 'Dismissible', type: 'boolean', default: true },
        ],
        render: (p) => (
          <div className="w-full max-w-md">
            <AlertBanner
              variant={p.variant as any}
              title={p.title as string || undefined}
              message={p.message as string}
              dismissible={p.dismissible as boolean}
            />
          </div>
        ),
        generateCode: (p) => {
          const attrs: string[] = [];
          if (p.variant !== 'info') attrs.push(`variant="${p.variant}"`);
          if (p.title)              attrs.push(`title="${p.title}"`);
          attrs.push(`message="${p.message}"`);
          if (p.dismissible)        attrs.push('dismissible');
          return `<AlertBanner\n  ${attrs.join('\n  ')}\n/>`;
        },
      },
      variants: [
        { title: 'Info', preview: <AlertBanner variant="info" title="System update" message="A new version is available. Please refresh the page." dismissible />, code: `<AlertBanner variant="info" title="System update" message="A new version is available." dismissible />` },
        { title: 'Success', preview: <AlertBanner variant="success" message="Profile updated successfully." dismissible />, code: `<AlertBanner variant="success" message="Profile updated successfully." dismissible />` },
        { title: 'Warning', preview: <AlertBanner variant="warning" title="Maintenance window" message="The service will be unavailable from 2–4 AM UTC." />, code: `<AlertBanner variant="warning" title="Maintenance window" message="The service will be unavailable from 2–4 AM UTC." />` },
        { title: 'Error', preview: <AlertBanner variant="error" title="Something went wrong" message="Unable to load the resource. Please try again." />, code: `<AlertBanner variant="error" title="Something went wrong" message="Unable to load the resource. Please try again." />` },
        {
          title: 'With CTA action',
          preview: (
            <AlertBanner variant="warning" title="Your plan is expiring" message="Upgrade before your trial ends to keep access."
              action={{ label: 'Upgrade now', onClick: () => alert('Upgrade clicked!') }} dismissible />
          ),
          code: `<AlertBanner variant="warning" title="Your plan is expiring" message="Upgrade before your trial ends."\n  action={{ label: 'Upgrade now', onClick: handleUpgrade }} dismissible />`,
          layout: 'stack' as const,
        },
        {
          title: 'Link CTA (action.href)',
          preview: (
            <AlertBanner variant="info" title="Documentation updated" message="New guides are available for the latest API changes."
              action={{ label: 'Read docs', href: '#' }} />
          ),
          code: `<AlertBanner variant="info" title="Documentation updated" message="New guides are available."\n  action={{ label: 'Read docs', href: '/docs/api' }} />`,
          layout: 'stack' as const,
        },
        {
          title: 'Custom icon',
          preview: (
            <AlertBanner variant="info" message="Custom icon override example." icon={<span>🚀</span>} />
          ),
          code: `<AlertBanner variant="info" message="Custom icon override." icon={<RocketIcon />} />`,
          layout: 'stack' as const,
        },
      ],
    },
    {
      id: 'toast',
      title: 'Toast',
      category: 'Organism',
      abbr: 'To',
      description: 'Notification system with success/warning/error/info/loading variants. Hover-to-freeze, progress bar, title, actions, and promise support.',
      filePath: 'modules/ui/Toast/index.tsx',
      sourceCode: `// Mount once at app root
<Toaster position="top-right" max={5} />

// Fire from anywhere
import { toast } from '@/modules/ui/Toast';

toast.success('Kaydedildi.');
toast.error('Hata oluştu.', { title: 'Bağlantı hatası' });
toast.loading('İşleniyor...');
toast.promise(fetchData(), {
  loading: 'Yükleniyor...',
  success: (d) => \`\${d.name} yüklendi.\`,
  error:   'Yüklenemedi.',
});

// With actions
toast.info('Öğe silindi.', {
  actions: [
    { label: 'Geri Al', onClick: (dismiss) => { undo(); dismiss(); } },
    { label: 'Kalıcı sil', onClick: (d) => { purge(); d(); }, variant: 'danger' },
  ],
});

// Programmatic control
toast.update(id, { message: 'Güncellendi.' });
toast.dismiss(id);
const { clear } = useToastStore();`,
      variants: [
        {
          title: 'Variants',
          layout: 'stack' as const,
          preview: <ToastVariantsDemo />,
          code: `toast.success('Kaydedildi.');\ntoast.info('Güncelleme mevcut.');\ntoast.warning('Oturum sona eriyor.');\ntoast.error('Sunucu hatası.'); // persistent`,
        },
        {
          title: 'Title + Message',
          layout: 'stack' as const,
          preview: <ToastTitleDemo />,
          code: `toast.success('Dosya yüklendi.', { title: 'Yükleme tamamlandı' });\ntoast.error('Sunucuya bağlanılamadı.', { title: 'Bağlantı hatası' });`,
        },
        {
          title: 'Actions',
          layout: 'stack' as const,
          preview: <ToastActionsDemo />,
          code: `toast.info('Öğe silindi.', {\n  title: 'Silindi',\n  actions: [\n    { label: 'Geri Al', onClick: (dismiss) => { undo(); dismiss(); } },\n    { label: 'Kalıcı sil', onClick: (d) => { purge(); d(); }, variant: 'danger' },\n  ],\n});`,
        },
        {
          title: 'Loading & Promise',
          layout: 'stack' as const,
          preview: <ToastLoadingDemo />,
          code: `// Loading state (persistent until updated)\ntoast.loading('İşleniyor...');\n\n// Promise: auto-transitions loading → success/error\ntoast.promise(fetchData(), {\n  loading: 'Yükleniyor...',\n  success: (data) => \`\${data.name} hazır.\`,\n  error: 'Yüklenemedi.',\n});`,
        },
        {
          title: 'toast.promise() API',
          layout: 'stack' as const,
          preview: <ToastPromiseApiDemo />,
          code: `// Single call drives one toast through loading → success | error.
// Strings or value-aware functions are accepted for success/error.
toast.promise(fetchUser(), {
  loading: 'Kullanıcı yükleniyor...',
  success: (u) => \`\${u.name} (#\${u.id}) yüklendi.\`,
  error:   (e) => \`Hata: \${(e as Error).message}\`,
});

// Error path resolves to an assertive role="alert" toast.
toast.promise(fetchBroken(), {
  loading: 'İstek gönderiliyor...',
  success: 'Tamamlandı!',
  error:   (e) => \`Başarısız: \${(e as Error).message}\`,
});`,
        },
      ],
    },
    {
      id: 'empty-state',
      title: 'EmptyState',
      category: 'Organism',
      abbr: 'Es',
      description: 'Empty-state message shown when there is no data. Supports icon, title, description, and action slots.',
      filePath: 'modules/ui/EmptyState.tsx',
      sourceCode: `import { cn } from '@/libs/utils/cn';

export function EmptyState({ icon, title, description, action, className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center py-16 px-6', className)}>
      {icon && <div className="h-12 w-12 rounded-full bg-surface-sunken flex items-center justify-center text-text-disabled text-2xl mb-4" aria-hidden="true">{icon}</div>}
      <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
      {description && <p className="mt-1 text-sm text-text-secondary max-w-xs">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}`,
      playground: {
        controls: [
          { key: 'icon',        label: 'Icon',        type: 'text',    default: '📁' },
          { key: 'title',       label: 'Title',       type: 'text',    default: 'No projects yet' },
          { key: 'description', label: 'Description', type: 'text',    default: 'Create your first project to get started.' },
          { key: 'showAction',  label: 'Show action', type: 'boolean', default: true },
        ],
        render: (p) => (
          <EmptyState
            icon={p.icon as string}
            title={p.title as string}
            description={p.description as string}
            action={p.showAction ? <Button variant="primary" size="sm">New project</Button> : undefined}
          />
        ),
        generateCode: (p) => {
          const attrs = [`icon="${p.icon}"`, `title="${p.title}"`, `description="${p.description}"`];
          if (p.showAction) attrs.push(`action={<Button variant="primary" size="sm">New project</Button>}`);
          return `<EmptyState\n  ${attrs.join('\n  ')}\n/>`;
        },
      },
      variants: [
        {
          title: 'With action',
          preview: (
            <EmptyState icon="📁" title="No projects yet" description="Create your first project to get started." action={<Button variant="primary" size="sm">New project</Button>} />
          ),
          code: `<EmptyState icon="📁" title="No projects yet" description="Create your first project to get started." action={<Button variant="primary" size="sm">New project</Button>} />`,
        },
        {
          title: 'Minimal',
          preview: <EmptyState title="No results found" description="Try adjusting your search or filters." />,
          code: `<EmptyState title="No results found" description="Try adjusting your search or filters." />`,
        },
      ],
    },
  ];
}
