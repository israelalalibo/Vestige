'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { use } from 'react';
import { getProductById, products } from '@/data/products';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';

export default function ProductDetailPage({ params }) {
  const { id } = use(params);
  const product = getProductById(id);
  if (!product) notFound();

  const { addItem, openCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize,
      color: selectedColor,
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    openCart();
  };

  return (
    <>
      {/* Breadcrumb */}
      <div className="pt-24 lg:pt-28 pb-6 px-6 lg:px-12 max-w-7xl mx-auto">
        <nav className="flex gap-2 text-xs text-vestige-gray tracking-widest uppercase">
          <Link href="/" className="hover:text-vestige-black transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-vestige-black transition-colors">Shop</Link>
          <span>/</span>
          <Link href={`/products?category=${product.category}`} className="hover:text-vestige-black transition-colors">{product.category}</Link>
          <span>/</span>
          <span className="text-vestige-black truncate">{product.name}</span>
        </nav>
      </div>

      {/* Product */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Images */}
        <div className="space-y-3">
          <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
            <Image
              src={product.images?.[activeImage] || product.image}
              alt={product.name}
              fill
              priority
              className="object-cover"
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative w-20 aspect-square bg-gray-100 overflow-hidden border-2 transition-colors ${
                    activeImage === i ? 'border-vestige-black' : 'border-transparent'
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-xs tracking-widest uppercase text-vestige-gray mb-2">{product.category}</p>
          <h1 className="font-display text-3xl md:text-4xl font-light leading-tight mb-3">{product.name}</h1>
          <p className="text-2xl mb-6">${product.price}</p>

          <p className="text-sm text-vestige-gray leading-relaxed mb-8">{product.description}</p>

          {/* Color */}
          <div className="mb-6">
            <p className="text-xs tracking-widest uppercase mb-3">
              Colour: <span className="text-vestige-black font-medium">{selectedColor}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 py-2 text-xs border transition-all ${
                    selectedColor === color
                      ? 'border-vestige-black bg-vestige-black text-white'
                      : 'border-gray-200 hover:border-vestige-black'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs tracking-widest uppercase">
                Size: <span className="text-vestige-black font-medium">{selectedSize}</span>
              </p>
              <button className="text-xs text-vestige-gray underline underline-offset-2 hover:text-vestige-black transition-colors">
                Size guide
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-[3rem] px-3 py-2 text-xs border transition-all ${
                    selectedSize === size
                      ? 'border-vestige-black bg-vestige-black text-white'
                      : 'border-gray-200 hover:border-vestige-black'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            className={`w-full py-4 text-sm tracking-widest uppercase transition-all duration-300 ${
              added
                ? 'bg-vestige-accent text-vestige-black'
                : 'bg-vestige-black text-vestige-white hover:bg-vestige-accent hover:text-vestige-black'
            }`}
          >
            {added ? '✓ Added to Cart' : 'Add to Cart'}
          </button>

          {/* Details */}
          <div className="mt-10 border-t border-gray-100 pt-8 space-y-3">
            <p className="text-xs tracking-widest uppercase mb-4">Product Details</p>
            {product.details.map((d) => (
              <p key={d} className="text-sm text-vestige-gray flex gap-3">
                <span className="text-vestige-accent mt-1">—</span>
                {d}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Related */}
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
