'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import WishlistButton from '@/components/WishlistButton';

export default function ProductDetail({ product, savedInWishlist }) {
  const { addItem, openCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);

  // Stock for the currently-selected size + color combination.
  const variantStock = useMemo(() => {
    const v = product.variants.find((x) => x.size === selectedSize && x.color === selectedColor);
    return v ? v.stock : null;
  }, [product.variants, selectedSize, selectedColor]);

  const stockBySize = useMemo(() => {
    const map = {};
    for (const v of product.variants) {
      if (v.color === selectedColor) map[v.size] = (map[v.size] || 0) + v.stock;
    }
    return map;
  }, [product.variants, selectedColor]);

  const soldOut = variantStock !== null && variantStock <= 0;

  const handleAddToCart = () => {
    if (soldOut) return;
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
    <div className="max-w-7xl mx-auto px-6 lg:px-12 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
      {/* Images */}
      <div className="space-y-3">
        <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
          {product.images?.[activeImage] && (
            <Image src={product.images[activeImage]} alt={product.name} fill priority className="object-cover" />
          )}
          {!product.inStock && (
            <span className="absolute top-4 left-4 bg-vestige-black text-white text-[10px] tracking-widest uppercase px-3 py-1.5">
              Sold Out
            </span>
          )}
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
        <div className="flex items-start justify-between gap-4">
          <p className="text-xs tracking-widest uppercase text-vestige-gray mb-2">{product.category}</p>
          <WishlistButton productId={product.id} initialSaved={savedInWishlist} className="text-vestige-gray hover:text-vestige-black -mt-1" />
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-light leading-tight mb-3">{product.name}</h1>
        <p className="text-2xl mb-6">${product.price.toFixed(2)}</p>

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
            {variantStock !== null && variantStock > 0 && variantStock <= 5 && (
              <span className="text-xs text-vestige-accent">Only {variantStock} left</span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => {
              const out = (stockBySize[size] || 0) <= 0;
              return (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  disabled={out}
                  className={`min-w-[3rem] px-3 py-2 text-xs border transition-all relative ${
                    selectedSize === size
                      ? 'border-vestige-black bg-vestige-black text-white'
                      : out
                      ? 'border-gray-100 text-gray-300 cursor-not-allowed line-through'
                      : 'border-gray-200 hover:border-vestige-black'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        {/* Add to cart */}
        <button
          onClick={handleAddToCart}
          disabled={soldOut}
          className={`w-full py-4 text-sm tracking-widest uppercase transition-all duration-300 ${
            soldOut
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : added
              ? 'bg-vestige-accent text-vestige-black'
              : 'bg-vestige-black text-vestige-white hover:bg-vestige-accent hover:text-vestige-black'
          }`}
        >
          {soldOut ? 'Sold Out' : added ? '✓ Added to Cart' : 'Add to Cart'}
        </button>

        {/* Details */}
        {product.details.length > 0 && (
          <div className="mt-10 border-t border-gray-100 pt-8 space-y-3">
            <p className="text-xs tracking-widest uppercase mb-4">Product Details</p>
            {product.details.map((d) => (
              <p key={d} className="text-sm text-vestige-gray flex gap-3">
                <span className="text-vestige-accent mt-1">—</span>
                {d}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
