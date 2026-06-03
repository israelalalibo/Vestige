'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import ProductCard from '@/components/ProductCard';
import { products, categories } from '@/data/products';

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [activeCategory, setActiveCategory] = useState(
    categories.includes(initialCategory) ? initialCategory : 'All'
  );
  const [sortBy, setSortBy] = useState('default');

  const filtered = useMemo(() => {
    let list = activeCategory === 'All' ? products : products.filter((p) => p.category === activeCategory);
    if (sortBy === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    if (sortBy === 'new') list = [...list].sort((a, b) => (b.new ? 1 : 0) - (a.new ? 1 : 0));
    return list;
  }, [activeCategory, sortBy]);

  return (
    <>
      {/* Page header */}
      <div className="pt-32 pb-10 px-6 lg:px-12 max-w-7xl mx-auto">
        <h1 className="font-display text-4xl md:text-5xl font-light">
          {activeCategory === 'All' ? 'All Products' : activeCategory}
        </h1>
        <p className="text-vestige-gray text-sm mt-2">{filtered.length} pieces</p>
      </div>

      {/* Filters */}
      <div className="sticky top-16 lg:top-20 bg-vestige-white/95 backdrop-blur-sm z-10 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-3 flex items-center justify-between gap-4 overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 flex-shrink-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
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
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs tracking-widest uppercase border-0 bg-transparent focus:outline-none cursor-pointer text-vestige-gray flex-shrink-0"
          >
            <option value="default">Sort: Featured</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="new">Newest First</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
        {filtered.length === 0 ? (
          <div className="text-center py-24 text-vestige-gray">
            <p className="text-sm">No products in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="pt-40 text-center text-vestige-gray text-sm">Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
