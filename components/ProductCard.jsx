'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';

export default function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false);
  const { addItem, openCart } = useCart();

  const handleQuickAdd = (e) => {
    e.preventDefault();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: product.sizes[0],
      color: product.colors[0],
      quantity: 1,
    });
    openCart();
  };

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div
        className="relative overflow-hidden bg-gray-100 aspect-[3/4]"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Image
          src={product.images?.[0] || product.image}
          alt={product.name}
          fill
          className={`object-cover transition-transform duration-700 ${hovered ? 'scale-105' : 'scale-100'}`}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.new && (
            <span className="bg-vestige-black text-vestige-white text-[10px] tracking-widest uppercase px-2.5 py-1">
              New
            </span>
          )}
        </div>

        {/* Quick add */}
        <div
          className={`absolute bottom-0 left-0 right-0 transition-all duration-300 ${
            hovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
          }`}
        >
          <button
            onClick={handleQuickAdd}
            className="w-full bg-vestige-black text-vestige-white py-3 text-xs tracking-widest uppercase hover:bg-vestige-accent hover:text-vestige-black transition-colors"
          >
            Quick Add
          </button>
        </div>
      </div>

      <div className="mt-3">
        <p className="text-xs text-vestige-gray tracking-widest uppercase mb-1">{product.category}</p>
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium leading-snug">{product.name}</p>
          <p className="text-sm text-vestige-gray flex-shrink-0">${product.price}</p>
        </div>
        {/* Color swatches hint */}
        {product.colors.length > 1 && (
          <p className="text-xs text-vestige-gray mt-1">{product.colors.length} colours</p>
        )}
      </div>
    </Link>
  );
}
