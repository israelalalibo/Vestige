'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState } from 'react';

export default function ProductFilters({ categories, activeCategory, activeSort, query }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(query || '');

  const setParam = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'All' && value !== 'default') params.set(key, value);
    else params.delete(key);
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  };

  const submitSearch = (e) => {
    e.preventDefault();
    setParam('q', search.trim());
  };

  return (
    <div className="sticky top-16 lg:top-20 bg-vestige-white/95 backdrop-blur-sm z-10 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-4 overflow-x-auto scrollbar-hide flex-shrink-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setParam('category', cat)}
              className={`text-xs tracking-widest uppercase whitespace-nowrap transition-colors pb-0.5 border-b ${
                activeCategory === cat
                  ? 'border-vestige-black text-vestige-black'
                  : 'border-transparent text-vestige-gray hover:text-vestige-black'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <form onSubmit={submitSearch} className="relative flex-1 lg:w-56">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              className="w-full border border-gray-200 px-3 py-1.5 text-xs focus:outline-none focus:border-vestige-black transition-colors"
            />
          </form>
          <select
            value={activeSort || 'default'}
            onChange={(e) => setParam('sort', e.target.value)}
            className="text-xs tracking-widest uppercase border-0 bg-transparent focus:outline-none cursor-pointer text-vestige-gray flex-shrink-0"
          >
            <option value="default">Sort: Featured</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="new">Newest First</option>
          </select>
        </div>
      </div>
    </div>
  );
}
