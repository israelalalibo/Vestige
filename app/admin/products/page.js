import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { formatCents } from '@/lib/money';
import DeleteButton from '@/components/admin/DeleteButton';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: { variants: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-light">Products</h1>
          <p className="text-vestige-gray text-sm mt-1">{products.length} products</p>
        </div>
        <Link href="/admin/products/new" className="px-5 py-2.5 text-xs tracking-widest uppercase bg-vestige-black text-white hover:bg-vestige-accent hover:text-vestige-black transition-colors">
          + New Product
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[10px] tracking-widest uppercase text-vestige-gray border-b border-gray-100">
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((p) => {
              const stock = p.variants.reduce((s, v) => s + v.stock, 0);
              return (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-12 bg-gray-100 flex-shrink-0 overflow-hidden rounded">
                        {p.images?.[0] && <Image src={p.images[0]} alt="" fill className="object-cover" />}
                      </div>
                      <span className="font-medium">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-vestige-gray">{p.category}</td>
                  <td className="px-4 py-3">{formatCents(p.priceCents)}</td>
                  <td className={`px-4 py-3 ${stock === 0 ? 'text-red-500' : stock <= 10 ? 'text-amber-600' : ''}`}>{stock}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] tracking-wide uppercase px-2 py-0.5 rounded-full ${p.active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                      {p.active ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <Link href={`/admin/products/${p.id}`} className="text-xs text-vestige-black hover:text-vestige-accent">Edit</Link>
                    <DeleteButton url={`/api/products/${p.id}`} confirmText={`Delete "${p.name}"? This cannot be undone.`} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
