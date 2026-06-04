import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { serializeProduct } from '@/lib/products';
import ProductCard from '@/components/ProductCard';

export const dynamic = 'force-dynamic';

export default async function WishlistPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login?callbackUrl=/wishlist');

  const items = await prisma.wishlistItem.findMany({
    where: { userId: user.id },
    include: { product: { include: { variants: true } } },
    orderBy: { createdAt: 'desc' },
  });

  const products = items.map((i) => serializeProduct(i.product)).filter(Boolean);

  return (
    <div className="min-h-screen pt-28 lg:pt-32 pb-20 px-6 lg:px-12 max-w-7xl mx-auto">
      <h1 className="font-display text-3xl md:text-4xl font-light mb-2">Wishlist</h1>
      <p className="text-vestige-gray text-sm mb-10">{products.length} saved item{products.length !== 1 ? 's' : ''}</p>

      {products.length === 0 ? (
        <div className="border border-gray-200 p-12 text-center">
          <p className="text-vestige-gray text-sm mb-4">You haven&apos;t saved anything yet.</p>
          <Link href="/products" className="btn-primary">Browse Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
