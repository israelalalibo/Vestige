import Link from 'next/link';
import ProductForm from '@/components/admin/ProductForm';

export default function NewProductPage() {
  return (
    <div>
      <Link href="/admin/products" className="text-xs tracking-widest uppercase text-vestige-gray hover:text-vestige-black">← Products</Link>
      <h1 className="font-display text-3xl font-light mt-4 mb-8">New Product</h1>
      <ProductForm />
    </div>
  );
}
