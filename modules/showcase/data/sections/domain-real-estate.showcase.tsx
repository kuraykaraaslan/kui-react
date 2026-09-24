'use client';
import type { ShowcaseComponent } from '../showcase.types';
import { PropertyStatusBadge } from '@/modules/domains/real-estate/property/PropertyStatusBadge';
import { PropertyTypeBadge } from '@/modules/domains/real-estate/property/PropertyTypeBadge';
import { ListingTypeBadge } from '@/modules/domains/real-estate/listing/ListingTypeBadge';
import { PropertyCard } from '@/modules/domains/real-estate/property/PropertyCard';
import { AgentCard } from '@/modules/domains/real-estate/agent/AgentCard';

/* ─── demo data ─── */

const DEMO_PROPERTY_SALE = {
  propertyId: 'demo-01',
  title: 'Luxury Bosphorus-View Apartment in Beşiktaş',
  slug: 'luxury-bosphorus-view-apartment-besiktas',
  price: 8_500_000,
  currency: 'TRY',
  type: 'APARTMENT' as const,
  listingType: 'SALE' as const,
  status: 'PUBLISHED' as const,
  bedrooms: 3,
  bathrooms: 2,
  area: 145,
  city: 'Istanbul',
  imageUrl: 'https://picsum.photos/seed/prop1/640/400',
};

const DEMO_VILLA = {
  propertyId: 'demo-03',
  title: 'Beachfront Villa with Private Pool — Lara',
  slug: 'beachfront-villa-private-pool-lara',
  price: 3_200,
  currency: 'USD',
  type: 'VILLA' as const,
  listingType: 'SHORT_TERM' as const,
  status: 'PUBLISHED' as const,
  bedrooms: 5,
  bathrooms: 4,
  area: 380,
  city: 'Antalya',
  imageUrl: 'https://picsum.photos/seed/prop3/640/400',
};

const DEMO_LAND = {
  propertyId: 'demo-04',
  title: 'Olive Grove Land Plot in Urla',
  slug: 'olive-grove-land-plot-urla',
  price: 950_000,
  currency: 'TRY',
  type: 'LAND' as const,
  listingType: 'SALE' as const,
  status: 'PUBLISHED' as const,
  area: 4_200,
  city: 'Izmir',
  imageUrl: null,
};

const DEMO_AGENT = {
  agentId: 'a-demo-01',
  name: 'Ayşe Yılmaz',
  email: 'ayse.yilmaz@estateview.com',
  phone: '+90 532 111 22 33',
  bio: 'With over 12 years of experience in Istanbul real estate, Ayşe specializes in luxury apartments and villas on the European side.',
  avatarUrl: 'https://i.pravatar.cc/150?img=47',
  listingCount: 14,
};

const DEMO_AGENT_MINIMAL = {
  agentId: 'a-demo-02',
  name: 'Murat Demir',
  email: 'murat.demir@estateview.com',
};

/* ─── builder ─── */

export function buildRealEstateDomainData(): ShowcaseComponent[] {
  return [
    {
      id: 'real-estate-property-status-badge',
      title: 'PropertyStatusBadge',
      category: 'Domain',
      abbr: 'RS',
      description: 'Displays property listing status with semantic colour coding.',
      filePath: 'modules/domains/real-estate/property/PropertyStatusBadge.tsx',
      sourceCode: `import { PropertyStatusBadge } from '@/modules/domains/real-estate/property/PropertyStatusBadge';
<PropertyStatusBadge status="PUBLISHED" />`,
      variants: [
        {
          title: 'All statuses',
          layout: 'stack',
          preview: (
            <div className="flex flex-wrap gap-2">
              {(['DRAFT', 'ACTIVE', 'PUBLISHED', 'SOLD', 'RENTED', 'ARCHIVED'] as const).map((s) => (
                <PropertyStatusBadge key={s} status={s} />
              ))}
            </div>
          ),
          code: `{(['DRAFT', 'ACTIVE', 'PUBLISHED', 'SOLD', 'RENTED', 'ARCHIVED'] as const).map((s) => (
  <PropertyStatusBadge key={s} status={s} />
))}`,
        },
        {
          title: 'Sizes',
          layout: 'stack',
          preview: (
            <div className="flex flex-wrap items-center gap-2">
              <PropertyStatusBadge status="PUBLISHED" size="sm" />
              <PropertyStatusBadge status="PUBLISHED" size="md" />
            </div>
          ),
          code: `<PropertyStatusBadge status="PUBLISHED" size="sm" />
<PropertyStatusBadge status="PUBLISHED" size="md" />`,
        },
      ],
    },
    {
      id: 'real-estate-property-type-badge',
      title: 'PropertyTypeBadge',
      category: 'Domain',
      abbr: 'RT',
      description: 'Colour-coded badge for property type (Apartment, House, Villa, etc.).',
      filePath: 'modules/domains/real-estate/property/PropertyTypeBadge.tsx',
      sourceCode: `import { PropertyTypeBadge } from '@/modules/domains/real-estate/property/PropertyTypeBadge';
<PropertyTypeBadge type="APARTMENT" />`,
      variants: [
        {
          title: 'All types',
          layout: 'stack',
          preview: (
            <div className="flex flex-wrap gap-2">
              {(['APARTMENT', 'HOUSE', 'VILLA', 'LAND', 'COMMERCIAL', 'OFFICE'] as const).map((t) => (
                <PropertyTypeBadge key={t} type={t} />
              ))}
            </div>
          ),
          code: `{(['APARTMENT', 'HOUSE', 'VILLA', 'LAND', 'COMMERCIAL', 'OFFICE'] as const).map((t) => (
  <PropertyTypeBadge key={t} type={t} />
))}`,
        },
        {
          title: 'Small size',
          layout: 'stack',
          preview: (
            <div className="flex flex-wrap gap-2">
              {(['APARTMENT', 'HOUSE', 'VILLA'] as const).map((t) => (
                <PropertyTypeBadge key={t} type={t} size="sm" />
              ))}
            </div>
          ),
          code: `<PropertyTypeBadge type="APARTMENT" size="sm" />`,
        },
      ],
    },
    {
      id: 'real-estate-listing-type-badge',
      title: 'ListingTypeBadge',
      category: 'Domain',
      abbr: 'LT',
      description: 'Badge indicating listing intent: For Sale, For Rent, or Short-term.',
      filePath: 'modules/domains/real-estate/listing/ListingTypeBadge.tsx',
      sourceCode: `import { ListingTypeBadge } from '@/modules/domains/real-estate/listing/ListingTypeBadge';
<ListingTypeBadge type="SALE" />`,
      variants: [
        {
          title: 'All listing types',
          layout: 'stack',
          preview: (
            <div className="flex flex-wrap gap-2">
              {(['SALE', 'RENT', 'SHORT_TERM'] as const).map((t) => (
                <ListingTypeBadge key={t} type={t} />
              ))}
            </div>
          ),
          code: `{(['SALE', 'RENT', 'SHORT_TERM'] as const).map((t) => (
  <ListingTypeBadge key={t} type={t} />
))}`,
        },
        {
          title: 'Small size',
          layout: 'stack',
          preview: (
            <div className="flex flex-wrap gap-2">
              <ListingTypeBadge type="SALE" size="sm" />
              <ListingTypeBadge type="RENT" size="sm" />
            </div>
          ),
          code: `<ListingTypeBadge type="SALE" size="sm" />
<ListingTypeBadge type="RENT" size="sm" />`,
        },
      ],
    },
    {
      id: 'real-estate-property-card',
      title: 'PropertyCard',
      category: 'Domain',
      abbr: 'PC',
      description: 'Summarises a property listing with image, price, type badges, specs, and location.',
      filePath: 'modules/domains/real-estate/property/PropertyCard.tsx',
      sourceCode: `import { PropertyCard } from '@/modules/domains/real-estate/property/PropertyCard';
<PropertyCard property={property} href="/properties/slug" />`,
      variants: [
        {
          title: 'For sale with image',
          preview: (
            <div className="max-w-xs">
              <PropertyCard property={DEMO_PROPERTY_SALE} href="#" />
            </div>
          ),
          code: `<PropertyCard property={property} href="/properties/slug" />`,
        },
        {
          title: 'Rental — no image (gradient placeholder)',
          preview: (
            <div className="max-w-xs">
              <PropertyCard property={DEMO_LAND} />
            </div>
          ),
          code: `<PropertyCard property={{ ...property, imageUrl: null }} />`,
        },
        {
          title: 'Short-term villa',
          preview: (
            <div className="max-w-xs">
              <PropertyCard property={DEMO_VILLA} href="#" />
            </div>
          ),
          code: `<PropertyCard property={villa} href="/properties/slug" />`,
        },
      ],
    },
    {
      id: 'real-estate-agent-card',
      title: 'AgentCard',
      category: 'Domain',
      abbr: 'AC',
      description: 'Real estate agent profile card with avatar, contact info, bio, and listing count.',
      filePath: 'modules/domains/real-estate/agent/AgentCard.tsx',
      sourceCode: `import { AgentCard } from '@/modules/domains/real-estate/agent/AgentCard';
<AgentCard agent={agent} />`,
      variants: [
        {
          title: 'Full profile',
          preview: (
            <div className="max-w-sm">
              <AgentCard agent={DEMO_AGENT} />
            </div>
          ),
          code: `<AgentCard agent={agent} />`,
        },
        {
          title: 'Minimal (no bio, no phone)',
          preview: (
            <div className="max-w-sm">
              <AgentCard agent={DEMO_AGENT_MINIMAL} />
            </div>
          ),
          code: `<AgentCard agent={{ agentId, name, email }} />`,
        },
      ],
    },
  ];
}
