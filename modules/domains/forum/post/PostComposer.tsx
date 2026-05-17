'use client';
import { useState } from 'react';
import { cn } from '@/libs/utils/cn';
import { Input } from '@/modules/ui/Input';
import { Textarea } from '@/modules/ui/Textarea';
import { Select } from '@/modules/ui/Select';
import { TagInput } from '@/modules/ui/TagInput';
import { TabGroup } from '@/modules/ui/TabGroup';
import { Button } from '@/modules/ui/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPaperPlane,
  faXmark,
  faPen,
  faEye,
} from '@fortawesome/free-solid-svg-icons';

type CategoryOption = { value: string; label: string };

type PostComposerProps = {
  categories: CategoryOption[];
  initialCategoryValue?: string;
  initialTitle?: string;
  initialBody?: string;
  initialTags?: string[];
  onSubmit?: (data: { title: string; body: string; tags: string[]; categoryValue: string }) => void;
  onCancel?: () => void;
  className?: string;
};

export function PostComposer({
  categories,
  initialCategoryValue,
  initialTitle = '',
  initialBody = '',
  initialTags = [],
  onSubmit,
  onCancel,
  className,
}: PostComposerProps) {
  const [title, setTitle] = useState(initialTitle);
  const [body, setBody] = useState(initialBody);
  const [tags, setTags] = useState<string[]>(initialTags);
  const [categoryValue, setCategoryValue] = useState(
    initialCategoryValue ?? categories[0]?.value ?? '',
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit?.({ title: title.trim(), body: body.trim(), tags, categoryValue });
  }

  const isValid = title.trim().length >= 3 && body.trim().length >= 10;

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'rounded-xl border border-border bg-surface-raised p-5 shadow-sm',
        className,
      )}
      aria-label="Create new topic"
    >
      <div className="space-y-4">
        <Input
          id="post-composer-title"
          label="Topic title"
          placeholder="Be specific and concise — at least 3 characters"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={150}
          showCount
        />

        <Select
          id="post-composer-category"
          label="Category"
          value={categoryValue}
          onChange={(e) => setCategoryValue(e.target.value)}
          options={categories}
          required
        />

        <TabGroup
          label="Compose / Preview"
          tabs={[
            {
              id: 'write',
              label: 'Write',
              icon: <FontAwesomeIcon icon={faPen} className="w-3 h-3" aria-hidden="true" />,
              content: (
                <Textarea
                  id="post-composer-body"
                  label="Body"
                  hint="Markdown supported. Be respectful and constructive."
                  placeholder="Share your thoughts in detail…"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={8}
                  required
                />
              ),
            },
            {
              id: 'preview',
              label: 'Preview',
              icon: <FontAwesomeIcon icon={faEye} className="w-3 h-3" aria-hidden="true" />,
              content: (
                <div className="rounded-lg border border-border bg-surface-base p-4 min-h-[12rem]">
                  {body.trim() ? (
                    <p className="whitespace-pre-wrap text-sm text-text-primary leading-relaxed">
                      {body}
                    </p>
                  ) : (
                    <p className="text-sm italic text-text-secondary">
                      Nothing to preview yet. Start writing in the Write tab.
                    </p>
                  )}
                </div>
              ),
            },
          ]}
        />

        <TagInput
          id="post-composer-tags"
          label="Tags"
          hint="Up to 5 — type and press Enter."
          value={tags.slice(0, 5)}
          onChange={(t) => setTags(t.slice(0, 5))}
          placeholder="e.g. nextjs, typescript…"
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-end gap-2 border-t border-border pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={onCancel}
            iconLeft={<FontAwesomeIcon icon={faXmark} className="w-3.5 h-3.5" aria-hidden="true" />}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={!isValid}
          iconLeft={<FontAwesomeIcon icon={faPaperPlane} className="w-3.5 h-3.5" aria-hidden="true" />}
        >
          Post topic
        </Button>
      </div>
    </form>
  );
}
