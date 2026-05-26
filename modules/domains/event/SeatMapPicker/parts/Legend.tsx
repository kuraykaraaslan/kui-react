'use client';
import { cn } from '@/libs/utils/cn';

export function Legend() {
  const items = [
    { cls: 'bg-success-subtle border-success', label: 'Müsait' },
    { cls: 'bg-primary border-primary', label: 'Seçili' },
    { cls: 'bg-warning-subtle border-warning', label: 'Rezerve' },
    { cls: 'bg-surface-sunken border-transparent opacity-40', label: 'Dolu' },
  ];
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-text-secondary">
      {items.map(({ cls, label }) => (
        <div key={label} className="flex items-center gap-1.5">
          <div className={cn('h-3.5 w-3.5 rounded border', cls)} />
          <span>{label}</span>
        </div>
      ))}
      <div className="flex items-center gap-1.5">
        <div className="relative h-3.5 w-3.5 rounded border border-success bg-success-subtle">
          <span className="absolute -top-1 -right-1 text-[6px]">♿</span>
        </div>
        <span>Engelsiz</span>
      </div>
    </div>
  );
}
