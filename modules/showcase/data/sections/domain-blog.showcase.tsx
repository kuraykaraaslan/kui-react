'use client';
import type { ShowcaseComponent } from '../showcase.types';
import { PostStatusBadge } from '@/modules/domains/blog/post/PostStatusBadge';
import { PostMeta } from '@/modules/domains/blog/post/PostMeta';
import { PostContent } from '@/modules/domains/blog/post/PostContent';
import { PostCard } from '@/modules/domains/blog/post/PostCard';
import { CategoryBadge } from '@/modules/domains/blog/category/CategoryBadge';
import { CommentForm } from '@/modules/domains/blog/comment/CommentForm';
import { CommentItem } from '@/modules/domains/blog/comment/CommentItem';
import { CommentList } from '@/modules/domains/blog/comment/CommentList';
import { AuthorBioCard } from '@/modules/domains/blog/author/AuthorBioCard';
import { TopicCloud } from '@/modules/domains/blog/author/TopicCloud';
import { AuthorStatsRow } from '@/modules/domains/blog/author/AuthorStatsRow';
import type { PostWithData, Comment } from '@/modules/domains/blog/types';

/* ─── demo data ─── */

const AUTHOR = {
  userId: 'u1',
  userProfile: {
    name: 'Alex Johnson',
    profilePicture: null,
    username: 'alexjohnson',
    biography: null,
  },
};

const CATEGORY = {
  categoryId: 'cat1',
  title: 'Technology',
  slug: 'technology',
  description: 'Tech news and articles.',
  image: null,
  keywords: ['tech', 'software'],
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
};

const HTML_CONTENT = `<h2>Introduction</h2>
<p>Next.js 16 brings powerful new tools alongside <strong>React 19</strong>. The App Router is now the recommended default.</p>
<h2>Server Components</h2>
<p>With Server Components, data fetching happens directly inside the component:</p>
<pre><code>async function Page() {
  const data = await fetch('/api/posts');
  return &lt;PostList posts={data} /&gt;;
}</code></pre>
<blockquote>Hydration cost drops to near zero, dramatically reducing page load times.</blockquote>
<ul>
  <li>Automatic code splitting</li>
  <li>Parallel data fetching</li>
  <li>Edge runtime support</li>
</ul>`;

const SAMPLE_POST: PostWithData = {
  postId: 'p1',
  title: 'Modern Web Development with Next.js 16',
  content: HTML_CONTENT,
  authorId: 'u1',
  description: 'A comprehensive guide to the new features in Next.js 16 and the App Router architecture.',
  slug: 'modern-web-development-nextjs-16',
  keywords: ['nextjs', 'react', 'web'],
  categoryId: 'cat1',
  image: null,
  status: 'PUBLISHED',
  views: 1248,
  createdAt: new Date('2026-04-01'),
  publishedAt: new Date('2026-04-01'),
  author: AUTHOR,
  category: CATEGORY,
};

const SAMPLE_POST_DRAFT: PostWithData = {
  ...SAMPLE_POST,
  postId: 'p2',
  title: "What's New in TypeScript 5.5",
  description: 'Inferred type predicates, isolated declarations, and other improvements in TypeScript 5.5.',
  status: 'DRAFT',
  views: 0,
  publishedAt: null,
};

const SAMPLE_COMMENTS: Comment[] = [
  {
    commentId: 'c1',
    content: 'Great article! Very thorough coverage of everything new in Next.js 16.',
    postId: 'p1',
    parentId: null,
    email: 'alice@example.com',
    name: 'Alice Carter',
    status: 'PUBLISHED',
    createdAt: new Date('2026-04-02'),
  },
  {
    commentId: 'c2',
    content: 'Agreed — the App Router section was especially helpful. Looking forward to the next post!',
    postId: 'p1',
    parentId: 'c1',
    email: 'bob@example.com',
    name: 'Bob Miller',
    status: 'PUBLISHED',
    createdAt: new Date('2026-04-03'),
  },
  {
    commentId: 'c3',
    content: 'Could you go into more detail on Server Components in a follow-up?',
    postId: 'p1',
    parentId: null,
    email: 'carol@example.com',
    name: 'Carol Smith',
    status: 'PUBLISHED',
    createdAt: new Date('2026-04-04'),
  },
];

/* ─── PostStatusBadge demos ─── */

function PostStatusAllDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3 p-4">
      <PostStatusBadge status="PUBLISHED" />
      <PostStatusBadge status="DRAFT" />
      <PostStatusBadge status="SCHEDULED" />
      <PostStatusBadge status="ARCHIVED" />
    </div>
  );
}

function PostStatusSizesDemo() {
  return (
    <div className="flex flex-wrap items-end gap-3 p-4">
      <PostStatusBadge status="PUBLISHED" size="sm" />
      <PostStatusBadge status="PUBLISHED" size="md" />
      <PostStatusBadge status="PUBLISHED" size="lg" />
    </div>
  );
}

/* ─── CategoryBadge demos ─── */

function CategoryBadgeVariantsDemo() {
  const cats = [
    { categoryId: 'c1', title: 'Technology', slug: 'technology', description: null, image: null },
    { categoryId: 'c2', title: 'Design',     slug: 'design',     description: null, image: null },
    { categoryId: 'c3', title: 'Career',     slug: 'career',     description: null, image: null },
  ];
  return (
    <div className="flex flex-wrap items-center gap-2 p-4">
      {cats.map((c) => <CategoryBadge key={c.categoryId} category={c} />)}
    </div>
  );
}

function CategoryBadgeSizesDemo() {
  const cat = { categoryId: 'c1', title: 'Technology', slug: 'technology', description: null, image: null };
  return (
    <div className="flex flex-wrap items-end gap-3 p-4">
      <CategoryBadge category={cat} size="sm" />
      <CategoryBadge category={cat} size="md" />
      <CategoryBadge category={cat} size="lg" />
    </div>
  );
}

/* ─── PostMeta demos ─── */

function PostMetaWithAvatarDemo() {
  return (
    <div className="p-4">
      <PostMeta post={SAMPLE_POST} showAvatar />
    </div>
  );
}

function PostMetaNoAvatarDemo() {
  return (
    <div className="p-4">
      <PostMeta post={SAMPLE_POST} showAvatar={false} />
    </div>
  );
}

/* ─── PostContent demos ─── */

function PostContentFullDemo() {
  return (
    <div className="p-6 max-w-2xl">
      <PostContent content={HTML_CONTENT} />
    </div>
  );
}

function PostContentSimpleDemo() {
  return (
    <div className="p-6 max-w-2xl">
      <PostContent content="<p>This is a simple paragraph.</p><p>A second paragraph follows with an inline <a href='#'>link</a>.</p>" />
    </div>
  );
}

/* ─── PostCard demos ─── */

function PostCardDefaultDemo() {
  return (
    <div className="p-4 max-w-sm">
      <PostCard post={SAMPLE_POST} />
    </div>
  );
}

function PostCardWithStatusDemo() {
  return (
    <div className="p-4 grid sm:grid-cols-2 gap-4 max-w-2xl">
      <PostCard post={SAMPLE_POST} showStatus />
      <PostCard post={SAMPLE_POST_DRAFT} showStatus />
    </div>
  );
}

/* ─── CommentForm demos ─── */

function CommentFormDefaultDemo() {
  return (
    <div className="p-6 max-w-xl">
      <CommentForm postId="p1" onSubmit={async () => {}} />
    </div>
  );
}

function CommentFormReplyDemo() {
  return (
    <div className="p-6 max-w-xl">
      <CommentForm postId="p1" parentId="c1" onSubmit={async () => {}} onCancel={() => {}} />
    </div>
  );
}

/* ─── CommentItem demos ─── */

function CommentItemSingleDemo() {
  return (
    <div className="p-6 max-w-xl">
      <CommentItem comment={SAMPLE_COMMENTS[0]} />
    </div>
  );
}

function CommentItemWithRepliesDemo() {
  return (
    <div className="p-6 max-w-xl">
      <CommentItem
        comment={SAMPLE_COMMENTS[0]}
        replies={[SAMPLE_COMMENTS[1]]}
        onSubmitReply={async () => {}}
      />
    </div>
  );
}

/* ─── CommentList demos ─── */

function CommentListFullDemo() {
  return (
    <div className="p-6 max-w-2xl">
      <CommentList
        comments={SAMPLE_COMMENTS}
        postId="p1"
        onSubmitComment={async () => {}}
      />
    </div>
  );
}

function CommentListEmptyDemo() {
  return (
    <div className="p-6 max-w-2xl">
      <CommentList
        comments={[]}
        postId="p1"
        onSubmitComment={async () => {}}
      />
    </div>
  );
}

/* ─── builder ─── */

export function buildBlogDomainData(): ShowcaseComponent[] {
  return [
    {
      id: 'blog-post-status-badge',
      title: 'PostStatusBadge',
      category: 'Domain',
      abbr: 'PS',
      description: 'Color-coded dot-badge for blog post status. PUBLISHED (green), DRAFT (amber), SCHEDULED (blue), ARCHIVED (neutral). Extends common/PublishStatusBadge by adding the SCHEDULED value.',
      filePath: 'modules/domains/blog/post/PostStatusBadge.tsx',
      sourceCode: `'use client';
import { PostStatusBadge } from '@/modules/domains/blog/post/PostStatusBadge';

<PostStatusBadge status="PUBLISHED" />
<PostStatusBadge status="DRAFT" size="sm" />
<PostStatusBadge status="SCHEDULED" size="lg" />
<PostStatusBadge status="ARCHIVED" />`,
      variants: [
        { title: 'All statuses', preview: <PostStatusAllDemo />, code: `<PostStatusBadge status="PUBLISHED" />\n<PostStatusBadge status="DRAFT" />\n<PostStatusBadge status="SCHEDULED" />\n<PostStatusBadge status="ARCHIVED" />` },
        { title: 'Sizes', preview: <PostStatusSizesDemo />, code: `<PostStatusBadge status="PUBLISHED" size="sm" />\n<PostStatusBadge status="PUBLISHED" size="md" />\n<PostStatusBadge status="PUBLISHED" size="lg" />` },
      ],
    },
    {
      id: 'blog-category-badge',
      title: 'CategoryBadge',
      category: 'Domain',
      abbr: 'CB',
      description: 'Renders a category name as a small primary-colored pill. Accepts Pick<Category, "title" | "slug"> — the full Category object is not required.',
      filePath: 'modules/domains/blog/category/CategoryBadge.tsx',
      sourceCode: `'use client';
import { CategoryBadge } from '@/modules/domains/blog/category/CategoryBadge';

<CategoryBadge category={post.category} />
<CategoryBadge category={{ title: 'Technology', slug: 'technology' }} size="sm" />`,
      variants: [
        { title: 'Categories', preview: <CategoryBadgeVariantsDemo />, code: `<CategoryBadge category={{ title: 'Technology', slug: 'technology' }} />\n<CategoryBadge category={{ title: 'Design', slug: 'design' }} />\n<CategoryBadge category={{ title: 'Career', slug: 'career' }} />` },
        { title: 'Sizes', preview: <CategoryBadgeSizesDemo />, code: `<CategoryBadge category={category} size="sm" />\n<CategoryBadge category={category} size="md" />\n<CategoryBadge category={category} size="lg" />` },
      ],
    },
    {
      id: 'blog-post-meta',
      title: 'PostMeta',
      category: 'Domain',
      abbr: 'PM',
      description: 'Inline row showing author avatar, name, publish date, estimated read time, and view count. Read time is calculated by stripping HTML tags and dividing word count by 200.',
      filePath: 'modules/domains/blog/post/PostMeta.tsx',
      sourceCode: `'use client';
import { PostMeta } from '@/modules/domains/blog/post/PostMeta';

// With avatar
<PostMeta post={post} showAvatar />

// Text only
<PostMeta post={post} showAvatar={false} />`,
      variants: [
        { title: 'With avatar', preview: <PostMetaWithAvatarDemo />, code: `<PostMeta post={post} showAvatar />` },
        { title: 'Without avatar', preview: <PostMetaNoAvatarDemo />, code: `<PostMeta post={post} showAvatar={false} />` },
      ],
    },
    {
      id: 'blog-post-content',
      title: 'PostContent',
      category: 'Domain',
      abbr: 'PC',
      description: 'Renders HTML blog content with token-based typography styles. Separate styles are defined for h1–h3, p, a, ul/ol, blockquote, code, pre, img, hr, and table.',
      filePath: 'modules/domains/blog/post/PostContent.tsx',
      sourceCode: `'use client';
import { PostContent } from '@/modules/domains/blog/post/PostContent';

<PostContent content={post.content} />`,
      variants: [
        { title: 'Rich content', layout: 'stack', preview: <PostContentFullDemo />, code: `<PostContent content={htmlContent} />` },
        { title: 'Simple paragraphs', layout: 'stack', preview: <PostContentSimpleDemo />, code: `<PostContent content="<p>First paragraph.</p><p>Second paragraph.</p>" />` },
      ],
    },
    {
      id: 'blog-post-card',
      title: 'PostCard',
      category: 'Domain',
      abbr: 'Pc',
      description: 'Listing card consuming PostWithData. Composed of cover image, category badge, title, description, and a PostMeta row. href renders an <a>, onClick a <button>, neither a plain <div>.',
      filePath: 'modules/domains/blog/post/PostCard.tsx',
      sourceCode: `'use client';
import { PostCard } from '@/modules/domains/blog/post/PostCard';

// As a link
<PostCard post={post} href={\`/blog/\${post.slug}\`} />

// With status badge (admin panel)
<PostCard post={post} showStatus href={\`/blog/\${post.slug}\`} />`,
      variants: [
        { title: 'Default', layout: 'stack', preview: <PostCardDefaultDemo />, code: `<PostCard post={post} href={\`/blog/\${post.slug}\`} />` },
        { title: 'With status badge', layout: 'stack', preview: <PostCardWithStatusDemo />, code: `<PostCard post={post} showStatus />\n<PostCard post={draftPost} showStatus />` },
      ],
    },
    {
      id: 'blog-comment-form',
      title: 'CommentForm',
      category: 'Domain',
      abbr: 'CF',
      description: 'Name, email, and content comment form with inline validation. Providing parentId switches it to reply mode; onCancel shows a Cancel button.',
      filePath: 'modules/domains/blog/comment/CommentForm.tsx',
      sourceCode: `'use client';
import { CommentForm } from '@/modules/domains/blog/comment/CommentForm';

// New comment
<CommentForm postId={post.postId} onSubmit={handleSubmit} />

// Reply mode
<CommentForm
  postId={post.postId}
  parentId={comment.commentId}
  onSubmit={handleSubmit}
  onCancel={() => setReplying(false)}
/>`,
      variants: [
        { title: 'New comment', layout: 'stack', preview: <CommentFormDefaultDemo />, code: `<CommentForm postId={post.postId} onSubmit={handleSubmit} />` },
        { title: 'Reply mode', layout: 'stack', preview: <CommentFormReplyDemo />, code: `<CommentForm postId={post.postId} parentId={comment.commentId} onSubmit={handleSubmit} onCancel={handleCancel} />` },
      ],
    },
    {
      id: 'blog-comment-item',
      title: 'CommentItem',
      category: 'Domain',
      abbr: 'CI',
      description: 'Single comment with initials-fallback avatar, name, date, content, and a Reply button. At depth < 1, clicking Reply opens an inline CommentForm; nested replies are indented with a left border.',
      filePath: 'modules/domains/blog/comment/CommentItem.tsx',
      sourceCode: `'use client';
import { CommentItem } from '@/modules/domains/blog/comment/CommentItem';

// Without replies
<CommentItem comment={comment} />

// With replies
<CommentItem
  comment={comment}
  replies={replies}
  onSubmitReply={handleReply}
/>`,
      variants: [
        { title: 'Single comment', layout: 'stack', preview: <CommentItemSingleDemo />, code: `<CommentItem comment={comment} />` },
        { title: 'With replies', layout: 'stack', preview: <CommentItemWithRepliesDemo />, code: `<CommentItem comment={comment} replies={replies} onSubmitReply={handleReply} />` },
      ],
    },
    {
      id: 'blog-comment-list',
      title: 'CommentList',
      category: 'Domain',
      abbr: 'CL',
      description: 'Filters to PUBLISHED comments, groups them 2 levels deep by parentId, and appends a new-comment form. Shows an encouraging empty state when there are no comments.',
      filePath: 'modules/domains/blog/comment/CommentList.tsx',
      sourceCode: `'use client';
import { CommentList } from '@/modules/domains/blog/comment/CommentList';

<CommentList
  comments={comments}
  postId={post.postId}
  onSubmitComment={handleSubmit}
/>`,
      variants: [
        { title: 'With comments', layout: 'stack', preview: <CommentListFullDemo />, code: `<CommentList comments={comments} postId={post.postId} onSubmitComment={handleSubmit} />` },
        { title: 'Empty state', layout: 'stack', preview: <CommentListEmptyDemo />, code: `<CommentList comments={[]} postId={post.postId} onSubmitComment={handleSubmit} />` },
      ],
    },
    {
      id: 'blog-author-bio-card',
      title: 'AuthorBioCard',
      category: 'Domain',
      abbr: 'AB',
      description: 'Author profile header with avatar, bio, role/verified badges, and social links.',
      filePath: 'modules/domains/blog/author/AuthorBioCard.tsx',
      sourceCode: `import { AuthorBioCard } from '@/modules/domains/blog/author/AuthorBioCard';
<AuthorBioCard name="John Nolan" biography="…" socials={{ twitter: '…' }} />`,
      variants: [
        {
          title: 'Verified author with socials',
          layout: 'stack',
          preview: (
            <div className="max-w-xl">
              <AuthorBioCard
                name="John Nolan"
                username="jnolan"
                biography="Late-career rookie. Notes from the field on systems, teams, and craft."
                role="Senior Editor"
                verified
                joinedAt={new Date('2024-08-10')}
                socials={{ twitter: 'https://x.com/jnolan', linkedin: 'https://linkedin.com/in/jnolan', github: 'https://github.com/jnolan', website: 'https://example.com' }}
              />
            </div>
          ),
          code: `<AuthorBioCard name="John Nolan" verified role="Senior Editor" socials={{ twitter, linkedin, github }} />`,
        },
        {
          title: 'Minimal author with follow',
          layout: 'stack',
          preview: (
            <div className="max-w-xl">
              <AuthorBioCard
                name="Oscar Reed"
                username="oscarreed"
                biography="Design systems writer focused on rhythm, grids, and clarity."
                isFollowing={false}
                onFollow={() => {}}
              />
            </div>
          ),
          code: `<AuthorBioCard name="Oscar Reed" username="oscarreed" onFollow={…} />`,
        },
      ],
    },
    {
      id: 'blog-topic-cloud',
      title: 'TopicCloud',
      category: 'Domain',
      abbr: 'TC',
      description: 'Weighted tag cloud where each topic is sized by its post count.',
      filePath: 'modules/domains/blog/author/TopicCloud.tsx',
      sourceCode: `import { TopicCloud } from '@/modules/domains/blog/author/TopicCloud';
<TopicCloud topics={[{ label: 'React', count: 12 }, …]} />`,
      variants: [
        {
          title: 'Mixed counts',
          layout: 'stack',
          preview: (
            <TopicCloud
              topics={[
                { label: 'React', count: 24 },
                { label: 'Design systems', count: 18 },
                { label: 'Editorial', count: 12 },
                { label: 'Strategy', count: 9 },
                { label: 'Research', count: 6 },
                { label: 'Typography', count: 4 },
                { label: 'Accessibility', count: 3 },
              ]}
            />
          ),
          code: `<TopicCloud topics={topics} />`,
        },
        {
          title: 'Compact range',
          layout: 'stack',
          preview: (
            <TopicCloud
              topics={[
                { label: 'JavaScript', count: 8, href: '#' },
                { label: 'TypeScript', count: 7, href: '#' },
                { label: 'Next.js', count: 6, href: '#' },
              ]}
              minSize={0.85}
              maxSize={1.1}
            />
          ),
          code: `<TopicCloud topics={topics} minSize={0.85} maxSize={1.1} />`,
        },
      ],
    },
    {
      id: 'blog-author-stats-row',
      title: 'AuthorStatsRow',
      category: 'Domain',
      abbr: 'AS',
      description: 'Horizontal stat strip for an author profile — posts, views, comments, likes, followers.',
      filePath: 'modules/domains/blog/author/AuthorStatsRow.tsx',
      sourceCode: `import { AuthorStatsRow } from '@/modules/domains/blog/author/AuthorStatsRow';
<AuthorStatsRow stats={{ posts: 42, views: 18400 }} />`,
      variants: [
        {
          title: 'All stats',
          layout: 'stack',
          preview: (
            <AuthorStatsRow
              stats={{ posts: 42, views: 18400, comments: 312, likes: 2640, followers: 1280 }}
            />
          ),
          code: `<AuthorStatsRow stats={{ posts, views, comments, likes, followers }} />`,
        },
        {
          title: 'Posts + followers',
          layout: 'stack',
          preview: <AuthorStatsRow stats={{ posts: 12, followers: 480 }} />,
          code: `<AuthorStatsRow stats={{ posts: 12, followers: 480 }} />`,
        },
      ],
    },
  ];
}
