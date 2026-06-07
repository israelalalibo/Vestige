import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Source catalog (mirrors data/products.js, prices in dollars -> converted to cents).
const catalog = [
  {
    slug: 'heavyweight-tee', name: 'Heavyweight Tee', price: 68, category: 'Tees',
    description: 'Cut from 320gsm 100% combed cotton. Thick, structured, and built to hold its shape wash after wash. Drop-shoulder fit with a slightly boxy silhouette — the kind of tee you reach for first.',
    details: ['320gsm combed cotton', 'Drop-shoulder, boxy fit', 'Pre-shrunk', 'Machine wash cold, tumble dry low'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], colors: ['Vintage Black', 'Washed White', 'Slate Grey', 'Brick Red'],
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80', 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80'],
    featured: true, isNew: true,
  },
  {
    slug: 'relaxed-hoodie', name: 'Relaxed Hoodie', price: 135, category: 'Hoodies',
    description: 'Garment-dyed in a 400gsm French terry blend. The slightly oversized fit and dropped shoulders make this the hoodie you never want to take off. Kangaroo pocket, ribbed cuffs.',
    details: ['400gsm French terry (80% cotton, 20% polyester)', 'Garment-dyed finish', 'Oversized fit, dropped shoulders', 'Kangaroo pocket', 'Machine wash cold inside out'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], colors: ['Carbon Black', 'Vintage Cream', 'Stone', 'Forest'],
    images: ['https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&q=80', 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80'],
    featured: true, isNew: true,
  },
  {
    slug: 'baggy-sweatpants', name: 'Baggy Sweatpants', price: 115, category: 'Sweatpants',
    description: 'A wide-leg sweatpant with a relaxed, lived-in feel. Elasticated waistband, side seam pockets, and a tapered ankle. Pairs with everything in the collection.',
    details: ['380gsm fleece (85% cotton, 15% polyester)', 'Wide-leg, tapered ankle', 'Elasticated waistband with drawcord', 'Side pockets + back patch pocket', 'Machine wash cold'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], colors: ['Black', 'Ash Grey', 'Ecru', 'Mocha'],
    images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80', 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80'],
    featured: true, isNew: false,
  },
  {
    slug: 'graphic-tee-vestige-script', name: 'Graphic Tee — Vestige Script', price: 75, category: 'Tees',
    description: "The same heavyweight 320gsm blank with a bold Vestige script print across the chest. Screen-printed in-house for a crisp, durable graphic that doesn't crack.",
    details: ['320gsm combed cotton', 'Water-based screen print', 'Drop-shoulder, boxy fit', 'Machine wash cold, inside out'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], colors: ['Vintage Black', 'Washed White'],
    images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80'],
    featured: false, isNew: true,
  },
  {
    slug: 'track-jacket', name: 'Track Jacket', price: 155, category: 'Outerwear',
    description: 'A zip-through track jacket in a waffle-knit cotton blend. Subtle tonal branding at the chest. Pairs naturally with the Baggy Sweatpants for a full set.',
    details: ['Waffle-knit cotton blend', 'Full-zip with ribbed collar', 'Chest pocket + side welt pockets', 'Relaxed fit', 'Machine wash cold'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], colors: ['Black', 'Cream', 'Khaki'],
    images: ['https://images.unsplash.com/photo-1544441893-675973e31985?w=800&q=80', 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80'],
    featured: true, isNew: false,
  },
  {
    slug: 'longsleeve-tee', name: 'Longsleeve Tee', price: 88, category: 'Tees',
    description: 'The same heavyweight blank as the core tee, extended to a long sleeve. Ribbed cuffs, clean construction, no print — just the silhouette.',
    details: ['320gsm combed cotton', 'Drop-shoulder, relaxed fit', 'Ribbed cuffs', 'Machine wash cold'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], colors: ['Vintage Black', 'Bone', 'Brick Red', 'Midnight Navy'],
    images: ['https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?w=800&q=80'],
    featured: false, isNew: true,
  },
  {
    slug: 'cargo-shorts', name: 'Cargo Shorts', price: 98, category: 'Bottoms',
    description: 'Mid-thigh length cargo shorts in a washed canvas twill. Double-knee panels and multiple utility pockets. A summer staple built for real wear.',
    details: ['100% washed canvas twill', 'Relaxed fit, mid-thigh length', 'Multiple cargo pockets', 'Elasticated waistband + drawcord', 'Machine wash cold'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], colors: ['Washed Black', 'Sand', 'Olive'],
    images: ['https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&q=80', 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=800&q=80'],
    featured: false, isNew: false,
  },
  {
    slug: 'snapback-cap', name: 'Snapback Cap', price: 45, category: 'Accessories',
    description: 'Structured six-panel snapback in heavyweight brushed cotton. Embroidered Vestige logo at the front panel, tonal snapback closure.',
    details: ['Heavyweight brushed cotton', 'Structured 6-panel', 'Embroidered logo', 'One size — adjustable snapback'],
    sizes: ['One Size'], colors: ['Black', 'Washed White', 'Khaki'],
    images: ['https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800&q=80'],
    featured: false, isNew: false,
  },
];

function skuFor(slug, size, color) {
  const c = color.replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase();
  const s = size.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  return `${slug.slice(0, 6).toUpperCase()}-${s}-${c}`;
}

async function main() {
  console.log('Seeding Vestige database…');

  // ---- Admin user ----
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@vestige.com').toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin12345';
  const adminHash = await bcrypt.hash(adminPassword, 10);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: 'ADMIN' },
    create: { email: adminEmail, name: 'Vestige Admin', passwordHash: adminHash, role: 'ADMIN' },
  });
  console.log(`  ✓ Admin user: ${adminEmail}`);

  // ---- A demo customer ----
  const demoHash = await bcrypt.hash('password123', 10);
  const customer = await prisma.user.upsert({
    where: { email: 'demo@vestige.com' },
    update: {},
    create: { email: 'demo@vestige.com', name: 'Demo Customer', passwordHash: demoHash, role: 'CUSTOMER' },
  });

  // ---- Products + variants ----
  const created = [];
  for (const p of catalog) {
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name, description: p.description, priceCents: p.price * 100,
        category: p.category, featured: p.featured, isNew: p.isNew, active: true,
        details: p.details, images: p.images,
      },
      create: {
        slug: p.slug, name: p.name, description: p.description, priceCents: p.price * 100,
        category: p.category, featured: p.featured, isNew: p.isNew, active: true,
        details: p.details, images: p.images,
      },
    });

    for (const size of p.sizes) {
      for (const color of p.colors) {
        const sku = skuFor(p.slug, size, color);
        // Vary stock; make a few combos low / out of stock for realistic alerts.
        const stock = Math.floor(Math.random() * 40);
        await prisma.variant.upsert({
          where: { productId_size_color: { productId: product.id, size, color } },
          update: { stock, sku },
          create: { productId: product.id, size, color, stock, sku },
        });
      }
    }
    created.push(product);
  }
  console.log(`  ✓ ${created.length} products with variants`);

  // ---- Coupons ----
  const coupons = [
    { code: 'WELCOME10', type: 'PERCENT', value: 10, minSubtotalCents: 0, active: true },
    { code: 'VESTIGE20', type: 'PERCENT', value: 20, minSubtotalCents: 15000, maxUses: 100, active: true },
    { code: 'FREESHIP', type: 'FIXED', value: 1000, minSubtotalCents: 5000, active: true },
  ];
  for (const c of coupons) {
    await prisma.coupon.upsert({ where: { code: c.code }, update: c, create: c });
  }
  console.log(`  ✓ ${coupons.length} coupons (try WELCOME10 / VESTIGE20 / FREESHIP)`);

  // ---- Newsletter subscribers ----
  for (const email of ['alex@example.com', 'sam@example.com', 'jordan@example.com']) {
    await prisma.newsletterSubscriber.upsert({ where: { email }, update: {}, create: { email } });
  }

  // ---- Approved reviews on a couple of products ----
  const tee = created.find((p) => p.slug === 'heavyweight-tee');
  if (tee) {
    await prisma.review.upsert({
      where: { productId_userId: { productId: tee.id, userId: customer.id } },
      update: {},
      create: {
        productId: tee.id, userId: customer.id, rating: 5,
        title: 'Best tee I own', body: 'The weight is unreal. Holds shape after a dozen washes.',
        status: 'APPROVED',
      },
    });
  }

  // ---- Sample paid orders across the last ~40 days (for dashboard charts) ----
  const existingOrders = await prisma.order.count();
  if (existingOrders === 0) {
    const now = Date.now();
    for (let i = 0; i < 28; i++) {
      const daysAgo = Math.floor(Math.random() * 40);
      const createdAt = new Date(now - daysAgo * 24 * 60 * 60 * 1000);
      const picks = created.slice().sort(() => 0.5 - Math.random()).slice(0, 1 + Math.floor(Math.random() * 3));
      const items = picks.map((p) => {
        const qty = 1 + Math.floor(Math.random() * 2);
        return {
          productId: p.id, name: p.name, size: 'M', color: 'Black',
          priceCents: p.priceCents, quantity: qty, image: p.images[0],
        };
      });
      const subtotal = items.reduce((s, it) => s + it.priceCents * it.quantity, 0);
      const shipping = subtotal >= 15000 ? 0 : 999;
      const total = subtotal + shipping;
      await prisma.order.create({
        data: {
          orderNumber: `VST-${(10000 + i).toString()}`,
          userId: i % 4 === 0 ? customer.id : null,
          email: i % 4 === 0 ? customer.email : `guest${i}@example.com`,
          status: 'PAID',
          subtotalCents: subtotal, shippingCents: shipping, discountCents: 0, totalCents: total,
          shippingName: 'Sample Buyer',
          createdAt,
          items: { create: items },
        },
      });
    }
    console.log('  ✓ 28 sample orders for dashboard metrics');
  }

  console.log('Done.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
