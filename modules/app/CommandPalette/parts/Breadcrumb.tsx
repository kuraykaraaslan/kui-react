'use client';
// TODO M3: render nested scope path "Navigation > Settings >" and
// expose Backspace-to-pop / Esc-to-pop semantics.

type BreadcrumbProps = {
  path: string[];
};

export function Breadcrumb({ path }: BreadcrumbProps) {
  if (!path.length) return null;
  // TODO M3: real styling + onLeave callbacks.
  return (
    <p className="text-xs text-text-secondary">
      {path.join(' > ')}
    </p>
  );
}
