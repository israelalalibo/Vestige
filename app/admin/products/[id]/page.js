import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProductForm from '@/components/admin/ProductForm';

export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { variants: true },
  });
  if (!product) notFound();

  return (
    <div>
      <Link href="/admin/products" className="text-xs tracking-widest uppercase text-vestige-gray hover:text-vestige-black">← Products</Link>
      <h1 className="font-display text-3xl font-light mt-4 mb-8">Edit — {product.name}</h1>
      <ProductForm product={product} />
    </div>
  );
}
