'use client';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenNib, faEye, faComments, faHeart, faUsers } from '@fortawesome/free-solid-svg-icons';

export type AuthorStats = {
  posts?: number;
  views?: number;
  comments?: number;
  likes?: number;
  followers?: number;
};

type AuthorStatsRowProps = {
  stats: AuthorStats;
  className?: string;
};

function compactNumber(n: number) {
  if (n < 1000) return n.toString();
  if (n < 1_000_000) return `${(n / 1000).toFixed(n < 10_000 ? 1 : 0).replace(/\.0$/, '')}k`;
  return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
}

export function AuthorStatsRow({ stats, className }: AuthorStatsRowProps) {
  const items: { key: keyof AuthorStats; icon: typeof faPenNib; label: string }[] = [
    { key: 'posts',     icon: faPenNib,  label: 'Posts'     },
    { key: 'views',     icon: faEye,     label: 'Views'     },
    { key: 'comments',  icon: faComments,label: 'Comments'  },
    { key: 'likes',     icon: faHeart,   label: 'Likes'     },
    { key: 'followers', icon: faUsers,   label: 'Followers' },
  ];

  const visible = items.filter((i) => stats[i.key] != null);
  if (!visible.length) return null;

  return (
    <dl
      className={cn(
        'grid grid-flow-col auto-cols-fr divide-x divide-border',
        'rounded-xl border border-border bg-surface-raised overflow-hidden',
        className,
      )}
    >
      {visible.map(({ key, icon, label }) => (
        <div key={key} className="flex flex-col items-center justify-center p-3 gap-1 min-w-0">
          <div className="flex items-center gap-1.5 text-text-secondary">
            <FontAwesomeIcon icon={icon} className="w-3 h-3" aria-hidden="true" />
            <dt className="text-[10px] uppercase tracking-wider">{label}</dt>
          </div>
          <dd className="font-bold text-lg text-text-primary leading-tight">
            {compactNumber(stats[key] ?? 0)}
          </dd>
        </div>
      ))}
    </dl>
  );
}
