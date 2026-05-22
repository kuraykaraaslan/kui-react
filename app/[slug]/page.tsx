import type { Metadata } from 'next';
import { ShowcaseShell } from '@/modules/showcase/ui/ShowcaseShell';
import NAV_GROUPS from '@/modules/showcase/data/showcase.menu';
import { buildPageTitle } from '@/libs/config/showcase.config';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = NAV_GROUPS.flatMap((g) => g.items).find((i) => i.id === slug);
  return { title: buildPageTitle(item?.title ?? slug) };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ShowcaseShell selectedId={slug} />;
}
