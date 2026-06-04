import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductById, getRelatedProducts } from '@/lib/products';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import ProductCard from '@/components/ProductCard';
import ProductDetail from '@/components/ProductDetail';
import Reviews from '@/components/Reviews';

export const dynamic = 'force-dynamic';

export default async function ProductDetailPage({ params }) {
  const product = await getProductById(params.id);
  if (!product) notFound();

  const user = await getCurrentUser();

  const [related, reviewRecords, wishlistEntry] = await Promise.all([
    getRelatedProducts(product.category, product.id),
    prisma.review.findMany({
      where: { productId: product.id, status: 'APPROVED' },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    user
      ? prisma.wishlistItem.findUnique({ where: { userId_productId: { userId: user.id, productId: product.id } } })
      : null,
  ]);

  const reviews = reviewRecords.map((r) => ({
    id: r.id,
    rating: r.rating,
    title: r.title,
    body: r.body,
    createdAt: r.createdAt,
    author: r.user?.name,
  }));
  const averageRating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  return (
    <>
      {/* Breadcrumb */}
      <div className="pt-24 lg:pt-28 pb-6 px-6 lg:px-12 max-w-7xl mx-auto">
        <nav className="flex gap-2 text-xs text-vestige-gray tracking-widest uppercase">
          <Link href="/" className="hover:text-vestige-black transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-vestige-black transition-colors">Shop</Link>
          <span>/</span>
          <Link href={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-vestige-black transition-colors">{product.category}</Link>
          <span>/</span>
          <span className="text-vestige-black truncate">{product.name}</span>
        </nav>
      </div>

      <ProductDetail product={product} savedInWishlist={!!wishlistEntry} />

      <Reviews productId={product.id} reviews={reviews} averageRating={averageRating} />

      {related.length > 0 && (
        <section className="border-t border-gray-100 max-w-7xl mx-auto px-6 lg:px-12 py-16">
          <h2 className="font-display text-2xl font-light mb-8">You Might Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
