import type { Metadata } from 'next';
import { ShowcaseDetail } from '@/modules/showcase/ui/ShowcaseDetail';
import NAV_GROUPS from '@/modules/showcase/data/showcase.menu';
import { buildPageTitle, SHOWCASE_LINKS } from '@/libs/config/showcase.config';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = NAV_GROUPS.flatMap((g) => g.items).find((i) => i.id === slug);
  return {
    title: buildPageTitle(item?.title ?? slug),
    // The root layout sets a site-wide canonical (the homepage) as a
    // fallback for pages that don't override it — every one of these
    // ~315 pages needs its own, or search engines see them all as
    // duplicates of the homepage (docs/dev/phase-7-showcase-and-dx.md 7.4).
    alternates: { canonical: `${SHOWCASE_LINKS.siteUrl}/${slug}` },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ShowcaseDetail slug={slug} />;
}
