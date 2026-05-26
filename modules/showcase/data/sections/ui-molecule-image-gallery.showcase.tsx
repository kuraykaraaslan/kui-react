'use client';
import { ImageGallery } from '@/modules/app/ImageGallery';
import type { ShowcaseComponent } from '../showcase.types';

const IMAGES = [
  { src: 'https://picsum.photos/seed/gal1/800/600',  alt: 'Mountain landscape',    caption: 'Sunrise over the Alps'       },
  { src: 'https://picsum.photos/seed/gal2/800/600',  alt: 'Ocean sunset',          caption: 'Golden hour at the coast'    },
  { src: 'https://picsum.photos/seed/gal3/800/600',  alt: 'Forest path',           caption: 'Morning mist in the forest'  },
  { src: 'https://picsum.photos/seed/gal4/800/600',  alt: 'City skyline',          caption: 'Downtown at dusk'            },
  { src: 'https://picsum.photos/seed/gal5/800/600',  alt: 'Desert dunes',          caption: 'Sahara at golden hour'       },
  { src: 'https://picsum.photos/seed/gal6/800/600',  alt: 'Snowy peaks',           caption: 'First snowfall of the year'  },
  { src: 'https://picsum.photos/seed/gal7/800/600',  alt: 'Tropical beach',        caption: 'Crystal-clear lagoon'        },
  { src: 'https://picsum.photos/seed/gal8/800/600',  alt: 'Autumn colors',         caption: 'Peak foliage season'         },
];

const SMALL_SET = IMAGES.slice(0, 4);

export function buildImageGalleryData(): ShowcaseComponent[] {
  return [
    {
      id: 'image-gallery',
      title: 'ImageGallery',
      category: 'Organism',
      abbr: 'IG',
      description:
        'Responsive image grid with a full-screen lightbox, right-click context menu (open, copy URL, move to first/last, remove), and drag-to-reorder. Supports 2–4 columns, square / video / portrait / auto aspect ratios, optional captions, zoom toggle, thumbnail strip, and full keyboard navigation (← → Escape).',
      filePath: 'modules/app/ImageGallery/index.tsx',
      sourceCode: `'use client';
import { ImageGallery } from '@/modules/app/ImageGallery';

const images = [
  { src: '/photo-1.jpg', alt: 'Mountain', caption: 'Sunrise over the Alps' },
  { src: '/photo-2.jpg', alt: 'Ocean',    caption: 'Golden hour' },
  { src: '/photo-3.jpg', alt: 'Forest',   caption: 'Morning mist' },
];

// Basic — lightbox only
<ImageGallery images={images} columns={3} aspect="square" />

// Editable — right-click menu + drag reorder
<ImageGallery
  images={images}
  columns={3}
  reorderable
  onReorder={(next) => setImages(next)}
  onRemove={(idx, img) => console.log('removed', img.alt)}
/>`,
      variants: [
        {
          title: 'Reorderable — drag + right-click menu',
          layout: 'stack' as const,
          preview: (
            <div className="w-full max-w-2xl space-y-2">
              <p className="text-xs text-text-secondary select-none">
                Drag images to reorder • Right-click for context menu
              </p>
              <ImageGallery
                images={IMAGES}
                columns={3}
                aspect="square"
                gap="md"
                reorderable
              />
            </div>
          ),
          code: `<ImageGallery
  images={images}
  columns={3}
  aspect="square"
  gap="md"
  reorderable
  onReorder={(next) => setImages(next)}
  onRemove={(idx, img) => console.log('removed', img.alt)}
/>`,
        },
        {
          title: '3-column grid — lightbox only',
          layout: 'stack' as const,
          preview: (
            <div className="w-full max-w-2xl">
              <ImageGallery images={IMAGES} columns={3} aspect="square" gap="md" />
            </div>
          ),
          code: `<ImageGallery
  images={images}
  columns={3}
  aspect="square"
  gap="md"
  lightbox
/>`,
        },
        {
          title: '2-column with captions',
          layout: 'stack' as const,
          preview: (
            <div className="w-full max-w-lg">
              <ImageGallery images={SMALL_SET} columns={2} aspect="video" gap="lg" showCaptions />
            </div>
          ),
          code: `<ImageGallery
  images={images}
  columns={2}
  aspect="video"
  gap="lg"
  showCaptions
  lightbox
/>`,
        },
        {
          title: '4-column compact',
          layout: 'stack' as const,
          preview: (
            <div className="w-full max-w-2xl">
              <ImageGallery images={IMAGES} columns={4} aspect="square" gap="sm" />
            </div>
          ),
          code: `<ImageGallery
  images={images}
  columns={4}
  aspect="square"
  gap="sm"
  lightbox
/>`,
        },
      ],
    },
  ];
}
