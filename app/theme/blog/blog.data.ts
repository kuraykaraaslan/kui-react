import type { Category, Comment, PostWithData } from '@/modules/domains/blog/types';
import type { SafeUser } from '@/modules/domains/common/types';

export const BLOG_AUTHORS: SafeUser[] = [
  {
    userId: 'u-author-1',
    email: 'john.nolan@example.com',
    userRole: 'AUTHOR',
    userStatus: 'ACTIVE',
    userProfile: {
      name: 'John Nolan',
      username: 'jnolan',
      biography: 'Late-career rookie. Notes from the field on systems, teams, and craft.',
      profilePicture: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=240&q=80',
    },
  },
  {
    userId: 'u-author-2',
    email: 'oscar@example.com',
    userRole: 'AUTHOR',
    userStatus: 'ACTIVE',
    userProfile: {
      name: 'Oscar Reed',
      username: 'oscarreed',
      biography: 'Design systems writer and interface engineer. Focused on rhythm, grids, and clarity.',
      profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80',
    },
  },
];

export const BLOG_CATEGORIES: Category[] = [
  {
    categoryId: 'cat-product',
    title: 'Product',
    description: 'Product thinking, discovery, and narrative frameworks.',
    slug: 'product',
    image: null,
    keywords: ['product', 'strategy', 'narrative'],
    createdAt: new Date('2026-01-12'),
    updatedAt: new Date('2026-03-10'),
  },
  {
    categoryId: 'cat-design',
    title: 'Design',
    description: 'Design systems, interface rhythm, and creative direction.',
    slug: 'design',
    image: null,
    keywords: ['design', 'systems', 'interface'],
    createdAt: new Date('2026-01-10'),
    updatedAt: new Date('2026-02-18'),
  },
  {
    categoryId: 'cat-research',
    title: 'Research',
    description: 'Research notes, field studies, and behavioral signals.',
    slug: 'research',
    image: null,
    keywords: ['research', 'insight'],
    createdAt: new Date('2026-01-05'),
    updatedAt: new Date('2026-02-22'),
  },
  {
    categoryId: 'cat-ops',
    title: 'Operations',
    description: 'Editorial workflows, publishing rituals, and team cadence.',
    slug: 'operations',
    image: null,
    keywords: ['operations', 'publishing'],
    createdAt: new Date('2026-01-08'),
    updatedAt: new Date('2026-03-01'),
  },
];

const LONGFORM_HTML = `
  <h2>Notes from the field</h2>
  <p>Every memorable product story starts with a quiet detail. A support ticket, a quote from research, a screenshot that feels off. We collect those moments and map them to product decisions.</p>
  <blockquote>Editorial teams are not just storytellers. They are signal amplifiers.</blockquote>
  <p>When we publish, we publish with constraints: three sections, one strong visual, and a single clear point of view. It forces clarity and makes the writing sharper.</p>
  <h3>What the team keeps on the wall</h3>
  <ul>
    <li>Lead with the human moment, not the feature.</li>
    <li>Design reads like a score, not a list.</li>
    <li>Every headline answers a real question.</li>
  </ul>
`;

const SHORT_HTML = `
  <p>A short editorial note exploring the craft behind calm, confident product launches.</p>
  <p>We start with the signal, then map it to one clear decision. The writing stays close to the work, not the hype.</p>
  <h2>The core practice</h2>
  <p>Each release gets a single narrative thread: what changed, who it helps, and why it matters now.</p>
  <blockquote>Good product writing is a mirror of product clarity.</blockquote>
  <ul>
    <li>One idea per section</li>
    <li>Evidence before adjectives</li>
    <li>Actionable takeaway at the end</li>
  </ul>
`;

export const BLOG_POSTS: PostWithData[] = [
  {
    postId: 'post-001',
    title: 'The Quiet Discipline of Product Narratives',
    content: LONGFORM_HTML,
    authorId: BLOG_AUTHORS[0].userId,
    description: 'How teams turn raw signals into stories that actually ship.',
    slug: 'quiet-discipline-product-narratives',
    keywords: ['product', 'storytelling', 'editorial'],
    categoryId: BLOG_CATEGORIES[0].categoryId,
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80',
    status: 'PUBLISHED',
    views: 4280,
    createdAt: new Date('2026-04-02'),
    updatedAt: new Date('2026-04-04'),
    publishedAt: new Date('2026-04-04'),
    author: BLOG_AUTHORS[0],
    category: BLOG_CATEGORIES[0],
  },
  {
    postId: 'post-002',
    title: 'Design Systems That Feel Like Music',
    content: SHORT_HTML,
    authorId: BLOG_AUTHORS[1].userId,
    description: 'A field guide to rhythm, repetition, and momentum in UI systems.',
    slug: 'design-systems-feel-like-music',
    keywords: ['design systems', 'rhythm'],
    categoryId: BLOG_CATEGORIES[1].categoryId,
    image: 'https://images.unsplash.com/photo-1487611459768-bd414656ea10?auto=format&fit=crop&w=1200&q=80',
    status: 'PUBLISHED',
    views: 2114,
    createdAt: new Date('2026-03-22'),
    updatedAt: new Date('2026-03-25'),
    publishedAt: new Date('2026-03-25'),
    author: BLOG_AUTHORS[1],
    category: BLOG_CATEGORIES[1],
  },
  {
    postId: 'post-003',
    title: 'Research Notes: Listening for the Hidden Problem',
    content: SHORT_HTML,
    authorId: BLOG_AUTHORS[0].userId,
    description: 'How we synthesize interviews into a clear decision map.',
    slug: 'research-notes-hidden-problem',
    keywords: ['research', 'insight'],
    categoryId: BLOG_CATEGORIES[2].categoryId,
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80',
    status: 'PUBLISHED',
    views: 980,
    createdAt: new Date('2026-03-10'),
    updatedAt: new Date('2026-03-12'),
    publishedAt: new Date('2026-03-12'),
    author: BLOG_AUTHORS[0],
    category: BLOG_CATEGORIES[2],
  },
  {
    postId: 'post-004',
    title: 'Editorial Operations for Calm Teams',
    content: SHORT_HTML,
    authorId: BLOG_AUTHORS[1].userId,
    description: 'A weekly cadence for publishing without chaos.',
    slug: 'editorial-operations-calm-teams',
    keywords: ['operations', 'workflow'],
    categoryId: BLOG_CATEGORIES[3].categoryId,
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    status: 'SCHEDULED',
    views: 0,
    createdAt: new Date('2026-04-08'),
    updatedAt: new Date('2026-04-08'),
    publishedAt: null,
    author: BLOG_AUTHORS[1],
    category: BLOG_CATEGORIES[3],
  },
  {
    postId: 'post-005',
    title: 'The Draft Library: Keeping the Work Warm',
    content: SHORT_HTML,
    authorId: BLOG_AUTHORS[0].userId,
    description: 'Why we keep a living archive of half-written ideas.',
    slug: 'draft-library-keeping-work-warm',
    keywords: ['writing', 'process'],
    categoryId: BLOG_CATEGORIES[0].categoryId,
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    status: 'DRAFT',
    views: 0,
    createdAt: new Date('2026-04-20'),
    updatedAt: new Date('2026-04-20'),
    publishedAt: null,
    author: BLOG_AUTHORS[0],
    category: BLOG_CATEGORIES[0],
  },
];

export const BLOG_COMMENTS: Comment[] = [
  {
    commentId: 'c-01',
    content: 'The cadence notes are so helpful. We struggled with this in our editorial team.',
    postId: BLOG_POSTS[0].postId,
    parentId: null,
    email: 'mila@example.com',
    name: 'Mila Torres',
    status: 'PUBLISHED',
    createdAt: new Date('2026-04-06'),
  },
  {
    commentId: 'c-02',
    content: 'The idea of signal amplifiers is gold. We are going to reframe our research review.',
    postId: BLOG_POSTS[0].postId,
    parentId: null,
    email: 'rafe@example.com',
    name: 'Rafe Grant',
    status: 'PUBLISHED',
    createdAt: new Date('2026-04-07'),
  },
  {
    commentId: 'c-03',
    content: 'We tried the three section constraint and it already helped our drafts.',
    postId: BLOG_POSTS[0].postId,
    parentId: 'c-02',
    email: 'kit@example.com',
    name: 'Kit Nguyen',
    status: 'PUBLISHED',
    createdAt: new Date('2026-04-08'),
  },
];

export const FEATURED_POST = BLOG_POSTS[0];

export function getPostBySlug(slug: string) {
  return BLOG_POSTS.find((post) => post.slug === slug) ?? null;
}

export function getCommentsByPostId(postId: string) {
  return BLOG_COMMENTS.filter((comment) => comment.postId === postId);
}

export function getAuthorById(userId: string) {
  return BLOG_AUTHORS.find((author) => author.userId === userId) ?? BLOG_AUTHORS[0];
}

export function getRelatedPosts(postId: string, limit = 3) {
  return BLOG_POSTS.filter((post) => post.postId !== postId).slice(0, limit);
}
