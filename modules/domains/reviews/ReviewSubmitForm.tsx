'use client';
import { useId, useState } from 'react';
import { cn } from '@/libs/utils/cn';
import { Button } from '@/modules/ui/Button';
import { Textarea } from '@/modules/ui/Textarea';
import { Input } from '@/modules/ui/Input';
import { StarRating } from '@/modules/ui/StarRating';

export type ReviewDraft = {
  rating: number;
  title: string;
  body: string;
};

type ReviewSubmitFormProps = {
  /** Called with the draft when the user submits a valid form. */
  onSubmit?: (draft: ReviewDraft) => void;
  /** Initial values. Defaults to an empty draft. */
  initialValue?: Partial<ReviewDraft>;
  /** Label shown above the form. Defaults to "Write a review". */
  title?: string;
  /** Submit button label. */
  submitLabel?: string;
  /** Disable the entire form. */
  disabled?: boolean;
  className?: string;
};

export function ReviewSubmitForm({
  onSubmit,
  initialValue,
  title = 'Write a review',
  submitLabel = 'Submit review',
  disabled = false,
  className,
}: ReviewSubmitFormProps) {
  const titleId = useId();
  const bodyId = useId();

  const [rating, setRating] = useState<number>(initialValue?.rating ?? 0);
  const [reviewTitle, setReviewTitle] = useState<string>(initialValue?.title ?? '');
  const [body, setBody] = useState<string>(initialValue?.body ?? '');
  const [touched, setTouched] = useState(false);

  const ratingError = touched && rating === 0 ? 'Please select a rating.' : undefined;
  const bodyError =
    touched && body.trim().length < 10
      ? 'Review must be at least 10 characters.'
      : undefined;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched(true);
    if (rating === 0 || body.trim().length < 10) return;
    onSubmit?.({ rating, title: reviewTitle.trim(), body: body.trim() });
    setRating(0);
    setReviewTitle('');
    setBody('');
    setTouched(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'rounded-xl border border-border bg-surface-raised p-5 sm:p-6',
        'flex flex-col gap-4',
        className
      )}
      aria-describedby={ratingError ? `${titleId}-rating-error` : undefined}
    >
      <div>
        <h3 className="text-base font-semibold text-text-primary">{title}</h3>
        <p className="text-xs text-text-secondary mt-0.5">
          Share your experience to help other people.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-text-primary">
          Overall rating
          <span className="text-error ml-1" aria-hidden="true">*</span>
          <span className="sr-only">(required)</span>
        </span>
        <StarRating
          value={rating}
          readonly={false}
          size="lg"
          onChange={setRating}
          aria-label="Overall rating"
        />
        {ratingError && (
          <p
            id={`${titleId}-rating-error`}
            className="text-xs text-error"
            role="alert"
          >
            {ratingError}
          </p>
        )}
      </div>

      <Input
        id={titleId}
        label="Title"
        placeholder="Sum up your experience in a short headline"
        value={reviewTitle}
        onChange={(e) => setReviewTitle(e.target.value)}
        disabled={disabled}
      />

      <Textarea
        id={bodyId}
        label="Your review"
        required
        rows={5}
        placeholder="Tell others what stood out — service, quality, value…"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        error={bodyError}
        hint="At least 10 characters."
        disabled={disabled}
      />

      <div className="flex justify-end">
        <Button type="submit" disabled={disabled}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
