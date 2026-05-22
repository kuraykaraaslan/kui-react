'use client';
import { useState } from 'react';
import { DocumentTitle } from '@/libs/utils/DocumentTitle';
import { THEME_TITLES } from '@/libs/config/showcase.config';
import { SearchBar } from '@/modules/ui/SearchBar';
import { MarketplaceListingCard } from '@/modules/domains/social/marketplace/MarketplaceListingCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStore } from '@fortawesome/free-solid-svg-icons';
import { MARKETPLACE_LISTINGS } from '../social.data';

const CATEGORIES = ['All', 'Furniture', 'Electronics', 'Photography', 'Books'];

export default function MarketplacePage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = MARKETPLACE_LISTINGS.filter((l) => {
    const matchSearch =
      !search ||
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.category.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === 'All' || l.category === activeCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="px-4 py-4 bg-surface-base border-r border-border min-h-full">
      <DocumentTitle text={`Marketplace — ${THEME_TITLES.social}`} />
      {/* Header */}
      <div className="sticky top-0 z-10 bg-surface-base/90 backdrop-blur-sm -mx-4 px-4 py-3 mb-4 border-b border-border flex items-center gap-2">
        <FontAwesomeIcon icon={faStore} className="w-4 h-4 text-primary" aria-hidden="true" />
        <h1 className="text-base font-bold text-text-primary">Marketplace</h1>
      </div>

      {/* Search */}
      <SearchBar
        value={search}
        onChange={setSearch}
        onClear={() => setSearch('')}
        placeholder="Search listings…"
        className="mb-4"
      />

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6" role="tablist" aria-label="Marketplace categories">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            role="tab"
            aria-selected={activeCategory === cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus ${
              activeCategory === cat
                ? 'bg-primary text-primary-fg'
                : 'bg-surface-overlay text-text-secondary hover:text-text-primary'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-text-secondary gap-2">
          <FontAwesomeIcon icon={faStore} className="w-10 h-10 text-text-disabled" aria-hidden="true" />
          <p className="text-sm">No listings found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map((listing) => (
            <MarketplaceListingCard
              key={listing.listingId}
              listing={listing}
              href={`/theme/social/marketplace`}
            />
          ))}
        </div>
      )}

      {/* Padding for mobile bottom nav */}
      <div className="h-20 lg:hidden" />
    </div>
  );
}
