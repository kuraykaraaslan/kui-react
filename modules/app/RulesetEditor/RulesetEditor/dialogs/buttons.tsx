'use client';
import { cn } from '@/libs/utils/cn';

export function PrimaryButton({ className, type = 'button', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={cn('flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-fg transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus', className)}
      {...props}
    />
  );
}

export function SecondaryButton({ className, type = 'button', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={cn('rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-text-secondary transition-colors hover:border-border-strong hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus', className)}
      {...props}
    />
  );
}

export function DangerButton({ className, type = 'button', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={cn('rounded-lg border border-error px-3 py-1.5 text-xs font-semibold text-error transition-colors hover:bg-error-subtle disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus', className)}
      {...props}
    />
  );
}
