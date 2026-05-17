'use client';
import type { ShowcaseComponent } from '../showcase.types';
import { RatingDistribution } from '@/modules/domains/reviews/RatingDistribution';
import { ReviewCard } from '@/modules/domains/reviews/ReviewCard';
import { ReviewSummaryCard } from '@/modules/domains/reviews/ReviewSummaryCard';
import { ReviewSubmitForm } from '@/modules/domains/reviews/ReviewSubmitForm';
import type { Review, ReviewSummary } from '@/modules/domains/reviews/types';

/* ─── demo data ─── */

const DEMO_SUMMARY: ReviewSummary = {
  subjectId: 'demo-subject',
  average: 4.3,
  total: 248,
  distribution: { 1: 6, 2: 12, 3: 24, 4: 86, 5: 120 },
};

const DEMO_SUMMARY_LOW: ReviewSummary = {
  subjectId: 'demo-subject-low',
  average: 2.4,
  total: 18,
  distribution: { 1: 7, 2: 4, 3: 3, 4: 2, 5: 2 },
};

const DEMO_REVIEW_VERIFIED: Review = {
  reviewId: 'rev-demo-1',
  subjectId: 'demo-subject',
  author: { name: 'Maya P.', avatarUrl: 'https://i.pravatar.cc/64?img=47' },
  rating: 5,
  title: 'Best margherita in town',
  body:
    'Wood-fired crust was perfectly charred and the buffalo mozzarella tasted like it just arrived from Italy. The basil was fragrant — a clear sign of fresh ingredients. Delivery was on time too.',
  createdAt: '2026-04-12T10:30:00Z',
  helpfulCount: 24,
  verified: true,
};

const DEMO_REVIEW_PLAIN: Review = {
  reviewId: 'rev-demo-2',
  subjectId: 'demo-subject',
  author: { name: 'Daniel R.', avatarUrl: null },
  rating: 3,
  title: null,
  body:
    "Food was good but arrived a little lukewarm. Packaging could be sturdier — one container had spilled by the time it got here.",
  createdAt: '2026-03-28T18:05:00Z',
  helpfulCount: 4,
  verified: false,
};

/* ─── builder ─── */

export function buildReviewsDomainData(): ShowcaseComponent[] {
  return [
    {
      id: 'reviews-rating-distribution',
      title: 'RatingDistribution',
      category: 'Domain',
      abbr: 'RD',
      description:
        'Horizontal bar chart of 1–5 star buckets. SVG-free, accessible via per-row progressbar roles.',
      filePath: 'modules/domains/reviews/RatingDistribution.tsx',
      since: '2026-05',
      sourceCode: `import { RatingDistribution } from '@/modules/domains/reviews';

<RatingDistribution
  distribution={{ 1: 6, 2: 12, 3: 24, 4: 86, 5: 120 }}
  total={248}
/>`,
      composes: [],
      designTokens: ['--warning', '--surface-sunken', '--text-secondary'],
      variants: [
        {
          title: 'Typical (4-star skew)',
          preview: (
            <div className="w-full max-w-md">
              <RatingDistribution
                distribution={DEMO_SUMMARY.distribution}
                total={DEMO_SUMMARY.total}
              />
            </div>
          ),
          code: `<RatingDistribution
  distribution={{ 1: 6, 2: 12, 3: 24, 4: 86, 5: 120 }}
  total={248}
/>`,
        },
        {
          title: 'Low-rated, counts hidden',
          preview: (
            <div className="w-full max-w-md">
              <RatingDistribution
                distribution={DEMO_SUMMARY_LOW.distribution}
                total={DEMO_SUMMARY_LOW.total}
                showCounts={false}
              />
            </div>
          ),
          code: `<RatingDistribution
  distribution={low.distribution}
  total={low.total}
  showCounts={false}
/>`,
        },
      ],
    },
    {
      id: 'reviews-review-card',
      title: 'ReviewCard',
      category: 'Domain',
      abbr: 'RC',
      description:
        'Single user review with avatar, star rating, optional verified badge, body, and an optimistic helpful counter.',
      filePath: 'modules/domains/reviews/ReviewCard.tsx',
      since: '2026-05',
      sourceCode: `import { ReviewCard } from '@/modules/domains/reviews';

<ReviewCard review={review} onHelpful={(id) => markHelpful(id)} />`,
      composes: ['avatar', 'badge', 'star-rating'],
      variants: [
        {
          title: 'Verified · 5 stars · with title',
          layout: 'stack',
          preview: (
            <div className="w-full max-w-xl">
              <ReviewCard review={DEMO_REVIEW_VERIFIED} />
            </div>
          ),
          code: `<ReviewCard review={review} />`,
        },
        {
          title: 'Anonymous · 3 stars · no title',
          layout: 'stack',
          preview: (
            <div className="w-full max-w-xl">
              <ReviewCard review={DEMO_REVIEW_PLAIN} />
            </div>
          ),
          code: `<ReviewCard review={review} />`,
        },
      ],
    },
    {
      id: 'reviews-review-summary-card',
      title: 'ReviewSummaryCard',
      category: 'Domain',
      abbr: 'RS',
      description:
        'Aggregated rating summary. Combines the average score, a big star strip, and the per-bucket distribution into a single card.',
      filePath: 'modules/domains/reviews/ReviewSummaryCard.tsx',
      since: '2026-05',
      sourceCode: `import { ReviewSummaryCard } from '@/modules/domains/reviews';

<ReviewSummaryCard
  summary={{ subjectId, average: 4.3, total: 248, distribution }}
/>`,
      composes: ['star-rating', 'reviews-rating-distribution'],
      variants: [
        {
          title: 'Default — restaurant',
          layout: 'stack',
          preview: (
            <div className="w-full max-w-2xl">
              <ReviewSummaryCard summary={DEMO_SUMMARY} reviewNoun="review" />
            </div>
          ),
          code: `<ReviewSummaryCard summary={summary} />`,
        },
        {
          title: 'Custom title — hotel guest ratings',
          layout: 'stack',
          preview: (
            <div className="w-full max-w-2xl">
              <ReviewSummaryCard
                summary={DEMO_SUMMARY_LOW}
                title="Guest ratings"
                reviewNoun="stay"
              />
            </div>
          ),
          code: `<ReviewSummaryCard
  summary={summary}
  title="Guest ratings"
  reviewNoun="stay"
/>`,
        },
      ],
    },
    {
      id: 'reviews-review-submit-form',
      title: 'ReviewSubmitForm',
      category: 'Domain',
      abbr: 'RF',
      description:
        'Composable submit form: interactive StarRating, optional title input, textarea with min-length validation, submit button.',
      filePath: 'modules/domains/reviews/ReviewSubmitForm.tsx',
      since: '2026-05',
      sourceCode: `import { ReviewSubmitForm } from '@/modules/domains/reviews';

<ReviewSubmitForm onSubmit={(draft) => api.createReview(draft)} />`,
      composes: ['star-rating', 'input', 'textarea', 'button'],
      variants: [
        {
          title: 'Default',
          layout: 'stack',
          preview: (
            <div className="w-full max-w-xl">
              <ReviewSubmitForm />
            </div>
          ),
          code: `<ReviewSubmitForm onSubmit={(d) => save(d)} />`,
        },
        {
          title: 'Custom labels — hotel review',
          layout: 'stack',
          preview: (
            <div className="w-full max-w-xl">
              <ReviewSubmitForm
                title="Share your stay"
                submitLabel="Post review"
              />
            </div>
          ),
          code: `<ReviewSubmitForm
  title="Share your stay"
  submitLabel="Post review"
/>`,
        },
      ],
    },
  ];
}
