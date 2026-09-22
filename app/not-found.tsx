import type { Metadata } from 'next';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';

export const metadata: Metadata = {
  title: { absolute: '404 — Not Found' },
};

// 1:1 with kui-ejs views/404.ejs (and kui-native app/+not-found.tsx).
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <p className="text-7xl font-bold text-primary mb-4">404</p>
      <h1 className="text-2xl font-semibold text-text-primary mb-2">Page not found</h1>
      <p className="text-text-secondary mb-8">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-fg font-medium hover:bg-primary-hover transition-colors"
      >
        <FontAwesomeIcon icon={faHouse} className="w-4 h-4" aria-hidden="true" />
        Back to showcase
      </Link>
    </div>
  );
}
