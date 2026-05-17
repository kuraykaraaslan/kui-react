'use client';
import { cn } from '@/libs/utils/cn';
import { Avatar } from '@/modules/ui/Avatar';
import { Badge } from '@/modules/ui/Badge';
import { Button } from '@/modules/ui/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXTwitter, faLinkedinIn, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faGlobe, faEnvelope } from '@fortawesome/free-solid-svg-icons';

export type AuthorBioCardProps = {
  name: string;
  username?: string;
  avatar?: string | null;
  biography?: string | null;
  role?: string;
  verified?: boolean;
  joinedAt?: Date | string;
  socials?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
    email?: string;
  };
  isFollowing?: boolean;
  onFollow?: () => void;
  className?: string;
};

function formatJoin(date?: Date | string) {
  if (!date) return null;
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
}

export function AuthorBioCard({
  name,
  username,
  avatar,
  biography,
  role,
  verified,
  joinedAt,
  socials,
  isFollowing,
  onFollow,
  className,
}: AuthorBioCardProps) {
  return (
    <article
      className={cn(
        'rounded-xl border border-border bg-surface-raised p-6 flex flex-col gap-4',
        className,
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <Avatar src={avatar ?? undefined} name={name} size="xl" />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold text-text-primary truncate">{name}</h2>
            {verified && <Badge variant="primary" size="sm">Verified</Badge>}
            {role && <Badge variant="neutral" size="sm">{role}</Badge>}
          </div>
          {username && (
            <p className="mt-0.5 text-sm text-text-secondary">@{username}</p>
          )}
          {joinedAt && (
            <p className="mt-1 text-xs text-text-disabled">
              Member since {formatJoin(joinedAt)}
            </p>
          )}
        </div>

        {onFollow && (
          <Button
            variant={isFollowing ? 'secondary' : 'primary'}
            size="sm"
            onClick={onFollow}
            aria-pressed={!!isFollowing}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </Button>
        )}
      </div>

      {biography && (
        <p className="text-sm text-text-secondary leading-relaxed">{biography}</p>
      )}

      {socials && (
        <div className="flex flex-wrap items-center gap-2 border-t border-border pt-3">
          {socials.twitter && (
            <SocialLink href={socials.twitter} icon={faXTwitter} label="Twitter" />
          )}
          {socials.linkedin && (
            <SocialLink href={socials.linkedin} icon={faLinkedinIn} label="LinkedIn" />
          )}
          {socials.github && (
            <SocialLink href={socials.github} icon={faGithub} label="GitHub" />
          )}
          {socials.website && (
            <SocialLink href={socials.website} icon={faGlobe} label="Website" />
          )}
          {socials.email && (
            <SocialLink href={`mailto:${socials.email}`} icon={faEnvelope} label="Email" />
          )}
        </div>
      )}
    </article>
  );
}

function SocialLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: typeof faGlobe;
  label: string;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex items-center justify-center h-8 w-8 rounded-full',
        'border border-border text-text-secondary',
        'hover:text-primary hover:border-primary transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
      )}
    >
      <FontAwesomeIcon icon={icon} className="w-3.5 h-3.5" aria-hidden="true" />
    </a>
  );
}
