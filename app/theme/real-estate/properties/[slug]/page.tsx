import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { buildPageTitle, THEME_TITLES } from '@/libs/config/showcase.config';
import { PROPERTIES, AGENTS } from '../../real-estate.data';
import { PropertyDetailClient } from './PropertyDetailClient';

export function generateStaticParams() {
  return PROPERTIES.map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const property = PROPERTIES.find((p) => p.slug === slug);
  return { title: buildPageTitle(property?.title ?? slug, THEME_TITLES['real-estate']) };
}

export default async function PropertyDetailPage({ params }: Props) {
  const { slug } = await params;
  const property = PROPERTIES.find((p) => p.slug === slug);
  if (!property) notFound();

  const agent = AGENTS.find((a) => a.agentId === property.agentId);
  const similar = PROPERTIES.filter(
    (p) => p.propertyId !== property.propertyId && (p.type === property.type || p.city === property.city)
  ).slice(0, 3);

  const images = property.images && property.images.length > 0 ? property.images : (property.imageUrl ? [property.imageUrl] : []);

  return (
    <PropertyDetailClient
      property={property}
      agent={agent}
      similar={similar}
      images={images}
    />
  );
}
