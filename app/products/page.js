import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import ProductFilters from '@/components/ProductFilters';
import { getProducts, getCategories } from '@/lib/products';

export const dynamic = 'force-dynamic';

export default async function ProductsPage({ searchParams }) {
  const q = searchParams.q || '';
  const category = searchParams.category || 'All';
  const sort = searchParams.sort || 'default';
  const page = Number(searchParams.page) || 1;

  const [{ products, total, pages }, categories] = await Promise.all([
    getProducts({ q, category, sort, page }),
    getCategories(),
  ]);

  const heading = q ? `Results for “${q}”` : category === 'All' ? 'All Products' : category;

  return (
    <>
      <div className="pt-32 pb-10 px-6 lg:px-12 max-w-7xl mx-auto">
        <h1 className="font-display text-4xl md:text-5xl font-light">{heading}</h1>
        <p className="text-vestige-gray text-sm mt-2">{total} piece{total !== 1 ? 's' : ''}</p>
      </div>

      <ProductFilters categories={categories} activeCategory={category} activeSort={sort} query={q} />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
        {products.length === 0 ? (
          <div className="text-center py-24 text-vestige-gray">
            <p className="text-sm">No products found.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {pages > 1 && (
              <div className="flex justify-center gap-2 mt-12">
                {Array.from({ length: pages }, (_, i) => i + 1).map((p) => {
                  const params = new URLSearchParams();
                  if (q) params.set('q', q);
                  if (category !== 'All') params.set('category', category);
                  if (sort !== 'default') params.set('sort', sort);
                  if (p !== 1) params.set('page', String(p));
                  return (
                    <Link
                      key={p}
                      href={`/products?${params.toString()}`}
                      className={`w-9 h-9 flex items-center justify-center text-xs border transition-colors ${
                        p === page ? 'border-vestige-black bg-vestige-black text-white' : 'border-gray-200 hover:border-vestige-black'
                      }`}
                    >
                      {p}
                    </Link>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
