import Image from 'next/image';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import NewsletterForm from '@/components/NewsletterForm';
import { getFeaturedProducts, getNewArrivals } from '@/data/products';

export default function HomePage() {
  const featured = getFeaturedProducts();
  const newArrivals = getNewArrivals();

  return (
    <>
      {/* Hero — full screen, mobile-first */}
      <section className="relative h-screen min-h-[700px] flex items-end overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=1600&q=85"
          alt="Vestige hero"
          fill
          priority
          className="object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Hero content — anchored to bottom for mobile readability */}
        <div className="relative w-full px-6 lg:px-12 pb-16 lg:pb-24 text-white max-w-7xl mx-auto">
          <p className="text-[10px] tracking-[0.35em] uppercase mb-3 opacity-70">Drop 01 — Now Live</p>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-8xl font-light leading-[0.95] mb-6">
            Leave a<br />Vestige
          </h1>
          <p className="text-sm opacity-75 leading-relaxed max-w-xs mb-8">
            Premium streetwear designed to outlast every season.
          </p>
          <Link
            href="/products"
            className="inline-block bg-white text-vestige-black px-8 py-4 text-xs tracking-widest uppercase hover:bg-vestige-accent transition-colors duration-300"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Ticker strip */}
      <div className="overflow-hidden bg-vestige-black py-4">
        <div className="flex gap-0 whitespace-nowrap" style={{ animation: 'marquee 30s linear infinite' }}>
          {Array(8).fill('FREE SHIPPING OVER $150  ·  PREMIUM HEAVYWEIGHT FABRIC  ·  LIMITED DROPS  ·  ').map((t, i) => (
            <span key={i} className="text-[10px] tracking-[0.3em] uppercase text-gray-400 px-6">{t}</span>
          ))}
        </div>
        <style>{`@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
      </div>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pt-16 pb-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[10px] tracking-widest uppercase text-vestige-gray mb-1.5">Just Dropped</p>
            <h2 className="font-display text-3xl md:text-4xl font-light">New Arrivals</h2>
          </div>
          <Link href="/products?category=New+Arrivals" className="text-[10px] tracking-widest uppercase text-vestige-gray border-b border-gray-300 pb-0.5 hover:text-vestige-black hover:border-vestige-black transition-colors">
            See All
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Featured / Full-bleed editorial */}
      <section className="relative h-[70vh] min-h-[450px] my-8 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1600&q=80"
          alt="Core collection"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative h-full flex flex-col items-center justify-center text-white text-center px-6">
          <p className="text-[10px] tracking-[0.35em] uppercase mb-3 opacity-70">Core Collection</p>
          <h2 className="font-display text-4xl md:text-6xl font-light mb-6">The Essentials</h2>
          <Link href="/products" className="btn-outline border-white text-white hover:bg-white hover:text-vestige-black inline-block">
            Shop Collection
          </Link>
        </div>
      </section>

      {/* Featured products grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[10px] tracking-widest uppercase text-vestige-gray mb-1.5">Handpicked</p>
            <h2 className="font-display text-3xl md:text-4xl font-light">Featured Pieces</h2>
          </div>
          <Link href="/products" className="text-[10px] tracking-widest uppercase text-vestige-gray border-b border-gray-300 pb-0.5 hover:text-vestige-black hover:border-vestige-black transition-colors">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Brand story */}
      <section className="bg-vestige-black text-white py-20 my-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[4/5] bg-gray-900 overflow-hidden order-2 lg:order-1">
            <Image
              src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80"
              alt="Vestige story"
              fill
              className="object-cover opacity-90"
            />
          </div>
          <div className="order-1 lg:order-2">
            <p className="text-[10px] tracking-[0.35em] uppercase text-gray-400 mb-4">Our Story</p>
            <h2 className="font-display text-4xl md:text-5xl font-light leading-tight mb-6">
              Built Different.<br />Made to Last.
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Vestige was born out of frustration with clothes that fall apart after a season. We source heavyweight fabrics, keep our drops small, and refuse to compromise on construction.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              Every piece ships in limited quantities. No restocks. If you sleep on it, it's gone.
            </p>
            <Link href="/products" className="inline-block border border-white text-white px-8 py-3 text-xs tracking-widest uppercase hover:bg-white hover:text-vestige-black transition-all duration-300">
              Shop the Brand
            </Link>
          </div>
        </div>
      </section>

      {/* Category quick-links */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <h2 className="font-display text-2xl font-light mb-6 text-center">Shop by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[
            { label: 'Tees', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80' },
            { label: 'Hoodies', img: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=500&q=80' },
            { label: 'Sweatpants', img: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&q=80' },
            { label: 'Outerwear', img: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=500&q=80' },
          ].map(({ label, img }) => (
            <Link key={label} href={`/products?category=${label}`} className="group relative aspect-square overflow-hidden">
              <Image src={img} alt={label} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/55 transition-colors" />
              <span className="absolute inset-0 flex items-end justify-start p-4 text-white text-xs tracking-widest uppercase">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Instagram social proof */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-12 text-center">
        <p className="text-[10px] tracking-widest uppercase text-vestige-gray mb-2">Community</p>
        <h2 className="font-display text-3xl font-light mb-2">@vestigeofficial</h2>
        <p className="text-sm text-vestige-gray mb-8">Tag us to be featured</p>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-1.5">
          {[
            'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80',
            'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&q=80',
            'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80',
            'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&q=80',
            'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400&q=80',
            'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=400&q=80',
          ].map((img, i) => (
            <div key={i} className="relative aspect-square overflow-hidden bg-gray-100 group">
              <Image src={img} alt={`Community post ${i + 1}`} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
          ))}
        </div>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-8 text-xs tracking-widest uppercase border-b border-vestige-black pb-0.5 hover:text-vestige-accent hover:border-vestige-accent transition-colors"
        >
          Follow on Instagram
        </a>
      </section>

      {/* Newsletter */}
      <section className="bg-vestige-black text-white py-16 px-6">
        <div className="max-w-lg mx-auto text-center">
          <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-3">Stay in the loop</p>
          <h2 className="font-display text-3xl font-light mb-3">Early Access. First in Line.</h2>
          <p className="text-gray-400 text-sm mb-8">Drop alerts, restock notifications, and members-only offers.</p>
          <NewsletterForm />
        </div>
      </section>
    </>
  );
}
