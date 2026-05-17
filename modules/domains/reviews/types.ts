import { z } from 'zod';
import { IdSchema } from '../common/BaseTypes';

/* =========================================================
   REUSABLE REVIEW / RATING SCHEMAS
   Used across food, event, real-estate, commerce, travel
   themes — any vertical where users rate a "subject".
========================================================= */

export const ReviewAuthorSchema = z.object({
  name: z.string(),
  avatarUrl: z.string().nullable().optional(),
});

export const ReviewSchema = z.object({
  reviewId: IdSchema,

  /** ID of the subject being reviewed (restaurantId, productId, hotelId, …). */
  subjectId: IdSchema,

  author: ReviewAuthorSchema,

  /** 1–5 whole-star rating supplied by the user. */
  rating: z.number().int().min(1).max(5),

  title: z.string().nullable().optional(),
  body: z.string(),

  /** ISO-8601 date string. Kept as string so it serialises across boundaries. */
  createdAt: z.string(),

  helpfulCount: z.number().int().nonnegative().default(0),

  /** Optional verification mark (e.g. verified purchase / verified stay). */
  verified: z.boolean().default(false),
});

/**
 * Aggregated summary for a subject. `distribution` is keyed by star bucket
 * (1–5) and holds the count of reviews at that level.
 */
export const ReviewSummarySchema = z.object({
  subjectId: IdSchema,
  average: z.number().min(0).max(5),
  total: z.number().int().nonnegative(),
  distribution: z.object({
    1: z.number().int().nonnegative(),
    2: z.number().int().nonnegative(),
    3: z.number().int().nonnegative(),
    4: z.number().int().nonnegative(),
    5: z.number().int().nonnegative(),
  }),
});

/* =========================================================
   TYPES
========================================================= */

export type ReviewAuthor = z.infer<typeof ReviewAuthorSchema>;
export type Review = z.infer<typeof ReviewSchema>;
export type ReviewSummary = z.infer<typeof ReviewSummarySchema>;
export type ReviewDistribution = ReviewSummary['distribution'];
