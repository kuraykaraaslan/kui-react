import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Badge } from '@/modules/ui/Badge';
import { Breadcrumb } from '@/modules/ui/Breadcrumb';
import { Button } from '@/modules/ui/Button';
import { Card } from '@/modules/ui/Card';
import { CategoryBadge } from '@/modules/domains/blog/category/CategoryBadge';
import { CommentForm } from '@/modules/domains/blog/comment/CommentForm';
import { CommentList } from '@/modules/domains/blog/comment/CommentList';
import { PostCard } from '@/modules/domains/blog/post/PostCard';
import { PostContent } from '@/modules/domains/blog/post/PostContent';
import { PostMeta } from '@/modules/domains/blog/post/PostMeta';
import { PostStatusBadge } from '@/modules/domains/blog/post/PostStatusBadge';
import { UserProfileCard } from '@/modules/domains/common/user/UserProfileCard';
import {
    BLOG_POSTS,
    getAuthorById,
    getCommentsByPostId,
    getPostBySlug,
    getRelatedPosts,
} from '../blog.data';
import { buildPageTitle, THEME_TITLES } from '@/libs/config/showcase.config';

export async function generateStaticParams() {
    return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    return { title: buildPageTitle(post?.title ?? slug, THEME_TITLES.blog) };
}

export default async function BlogPostPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    const author = getAuthorById(post.author.userId);
    const comments = getCommentsByPostId(post.postId);
    const relatedPosts = getRelatedPosts(post.postId, 3);
    const keywords = post.keywords ?? [];

    return (
        <div className="bg-surface-base text-text-primary">
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_80%_0%,_var(--primary-subtle),_transparent_65%)]" />
                    <div className="absolute -top-20 left-10 h-64 w-64 rounded-full bg-secondary/10 blur-3xl" />
                </div>

                <div className="mx-auto max-w-6xl px-6 pt-10 pb-12">
                    <Breadcrumb
                        items={[
                            { label: 'Home', href: '/' },
                            { label: 'Domains', href: '/domain' },
                            { label: 'Blog', href: '/domains/blog' },
                            { label: post.title },
                        ]}
                        className="text-text-secondary"
                    />

                    <div className="mt-8 grid gap-10 lg:grid-cols-[60%_40%]">
                        <div className="space-y-6">
                            <div className="flex flex-wrap items-center gap-2">
                                <CategoryBadge category={post.category} size="sm" />
                                {post.status !== 'PUBLISHED' && (
                                    <PostStatusBadge status={post.status} size="sm" />
                                )}
                            </div>
                            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
                                {post.title}
                            </h1>
                            {post.description && (
                                <p className="text-lg text-text-secondary max-w-2xl">
                                    {post.description}
                                </p>
                            )}
                            <PostMeta post={post} showAvatar />
                            {post.image && (
                                <div className="overflow-hidden rounded-2xl border border-border bg-surface-sunken">
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="space-y-6">
                            <Card title="Story details" subtitle="Quick context before you dive in.">
                                <div className="space-y-4 text-sm text-text-secondary">
                                    <div className="flex items-center justify-between">
                                        <span>Status</span>
                                        <span className="text-text-primary font-semibold">{post.status}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>Category</span>
                                        <span className="text-text-primary font-semibold">{post.category.title}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>Views</span>
                                        <span className="text-text-primary font-semibold">{post.views.toLocaleString('en-US')}</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-text-secondary uppercase tracking-[0.2em]">
                                            Keywords
                                        </p>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {keywords.length === 0 ? (
                                                <Badge variant="neutral" size="sm">Editorial</Badge>
                                            ) : (
                                                keywords.map((keyword) => (
                                                    <Badge key={keyword} variant="neutral" size="sm">{keyword}</Badge>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 pt-2">
                                        <Button variant="outline" size="sm">Share</Button>
                                        <Button variant="ghost" size="sm">Save</Button>
                                    </div>
                                </div>
                            </Card>

                            <UserProfileCard user={author} />
                        </div>
                    </div>
                </div>
            </section>

            <section id="community" className="mx-auto max-w-6xl px-6 pb-16">
                <div className="grid gap-8 lg:grid-cols-[60%_40%]">
                    <div className="space-y-8">
                        <PostContent content={post.content} />
                        <Card title="Community" subtitle="Conversation around this story.">
                            <div className="space-y-8">
                                <CommentList comments={comments} postId={post.postId} />
                                <div className="border-t border-border pt-6">
                                    <h3 className="text-base font-semibold text-text-primary mb-4">
                                        Leave a comment
                                    </h3>
                                    <CommentForm postId={post.postId} />
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card title="Related stories" subtitle="More from the archive.">
                            <div className="space-y-4">
                                {relatedPosts.map((item) => (
                                    <PostCard
                                        key={item.postId}
                                        post={item}
                                        showStatus={item.status !== 'PUBLISHED'}
                                        href={`/domains/blog/${item.slug}`}
                                    />
                                ))}
                            </div>
                        </Card>

                        <Card title="Continue reading" subtitle="Return to the full archive.">
                            <a
                                href="/domains/blog/archive"
                                className="inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors px-3 py-1.5 text-sm bg-primary text-primary-fg hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                            >
                                View archive
                            </a>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    );
}
