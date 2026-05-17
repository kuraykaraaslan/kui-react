'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { PostComposer } from '@/modules/domains/forum/post/PostComposer';
import { FORUM_CATEGORIES } from '../../forum.data';

export default function NewTopicPage() {
  const categoryOptions = FORUM_CATEGORIES.map((c) => ({
    value: c.slug,
    label: c.title,
  }));

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <a
        href="/theme/forum/topics"
        className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary mb-4 transition-colors"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-3" aria-hidden="true" />
        Back to topics
      </a>

      <header className="mb-5">
        <h1 className="text-2xl font-bold text-text-primary">Start a new topic</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Got a question or something to share? Be specific and respectful — the community will help you out.
        </p>
      </header>

      <PostComposer
        categories={categoryOptions}
        initialCategoryValue={categoryOptions[1]?.value}
        onSubmit={(data) => {
          // Demo: log the submission. A real flow would POST to an API and redirect to the topic.
          // eslint-disable-next-line no-console
          console.log('New topic submitted:', data);
        }}
        onCancel={() => {
          if (typeof window !== 'undefined') window.history.back();
        }}
      />
    </div>
  );
}
