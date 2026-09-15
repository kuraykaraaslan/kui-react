'use client';
import { cn } from '@/libs/utils/cn';

type SectionCardProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

export function SectionCard({ title, children, className }: SectionCardProps) {
  return (
    <div className={cn('rounded-xl border border-border bg-surface-raised p-6 space-y-4', className)}>
      <h3 className="text-sm font-semibold text-text-primary border-b border-border pb-3">{title}</h3>
      {children}
    </div>
  );
}
