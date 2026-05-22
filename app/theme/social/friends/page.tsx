'use client';
import { useState } from 'react';
import { DocumentTitle } from '@/libs/utils/DocumentTitle';
import { THEME_TITLES } from '@/libs/config/showcase.config';
import { SearchBar } from '@/modules/ui/SearchBar';
import { SocialProfileCard } from '@/modules/domains/social/profile/SocialProfileCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { USERS } from '../social.data';

export default function FriendsPage() {
  const [search, setSearch] = useState('');

  const following = USERS.filter((u) => u.isFollowing);
  const suggestions = USERS.filter((u) => !u.isFollowing);

  const filtered = (list: typeof USERS) =>
    search
      ? list.filter(
          (u) =>
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.username.toLowerCase().includes(search.toLowerCase())
        )
      : list;

  return (
    <div className="px-4 py-4 bg-surface-base border-r border-border min-h-full">
      <DocumentTitle text={`Friends — ${THEME_TITLES.social}`} />
      {/* Header */}
      <div className="sticky top-0 z-10 bg-surface-base/90 backdrop-blur-sm -mx-4 px-4 py-3 mb-4 border-b border-border flex items-center gap-2">
        <FontAwesomeIcon icon={faUsers} className="w-4 h-4 text-primary" aria-hidden="true" />
        <h1 className="text-base font-bold text-text-primary">Friends</h1>
      </div>

      <SearchBar
        value={search}
        onChange={setSearch}
        onClear={() => setSearch('')}
        placeholder="Search people…"
        className="mb-6"
      />

      {/* Following */}
      {filtered(following).length > 0 && (
        <section className="mb-8" aria-label="People you follow">
          <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-3">
            Following ({filtered(following).length})
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {filtered(following).map((user) => (
              <SocialProfileCard key={user.userId} user={user} />
            ))}
          </div>
        </section>
      )}

      {/* Suggestions */}
      {filtered(suggestions).length > 0 && (
        <section aria-label="Suggested people to follow">
          <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-3">
            Suggested for you
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {filtered(suggestions).map((user) => (
              <SocialProfileCard key={user.userId} user={user} />
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {filtered(following).length === 0 && filtered(suggestions).length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-text-secondary gap-2">
          <FontAwesomeIcon icon={faUsers} className="w-10 h-10 text-text-disabled" aria-hidden="true" />
          <p className="text-sm">No results for "{search}"</p>
        </div>
      )}

      {/* Padding for mobile bottom nav */}
      <div className="h-20 lg:hidden" />
    </div>
  );
}
