import { prisma } from '@/lib/prisma';

// Canonical size ordering so derived size lists render sensibly.
const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'One Size'];

function orderSizes(sizes) {
  return [...sizes].sort((a, b) => {
    const ia = SIZE_ORDER.indexOf(a);
    const ib = SIZE_ORDER.indexOf(b);
    if (ia === -1 && ib === -1) return a.localeCompare(b);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });
}

/**
 * Convert a Prisma Product (with variants) into the shape the storefront
 * components expect — keeping `price` in dollars so the existing cart logic
 * (which works in dollars) is untouched.
 */
export function serializeProduct(p) {
  if (!p) return null;
  const variants = p.variants || [];
  const sizes = orderSizes([...new Set(variants.map((v) => v.size))]);
  const colors = [...new Set(variants.map((v) => v.color))];
  const totalStock = variants.reduce((s, v) => s + v.stock, 0);

  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description,
    category: p.category,
    price: p.priceCents / 100,
    priceCents: p.priceCents,
    image: p.images?.[0] || null,
    images: p.images || [],
    sizes: sizes.length ? sizes : ['One Size'],
    colors: colors.length ? colors : ['Default'],
    details: p.details || [],
    featured: p.featured,
    new: p.isNew,
    active: p.active,
    variants: variants.map((v) => ({ id: v.id, size: v.size, color: v.color, stock: v.stock })),
    totalStock,
    inStock: totalStock > 0,
  };
}

export async function getProducts({ q, category, sort, page = 1, perPage = 12, includeInactive = false } = {}) {
  const where = { ...(includeInactive ? {} : { active: true }) };
  if (category && category !== 'All') where.category = category;
  if (q) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
      { category: { contains: q, mode: 'insensitive' } },
    ];
  }

  let orderBy = [{ featured: 'desc' }, { createdAt: 'desc' }];
  if (sort === 'price-asc') orderBy = [{ priceCents: 'asc' }];
  else if (sort === 'price-desc') orderBy = [{ priceCents: 'desc' }];
  else if (sort === 'new') orderBy = [{ isNew: 'desc' }, { createdAt: 'desc' }];

  const [records, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      include: { variants: true },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products: records.map(serializeProduct),
    total,
    pages: Math.ceil(total / perPage),
    page,
  };
}

export async function getProductById(id) {
  const p = await prisma.product.findUnique({ where: { id }, include: { variants: true } });
  return serializeProduct(p);
}

export async function getFeaturedProducts(limit = 4) {
  const records = await prisma.product.findMany({
    where: { active: true, featured: true },
    include: { variants: true },
    take: limit,
    orderBy: { createdAt: 'desc' },
  });
  return records.map(serializeProduct);
}

export async function getNewArrivals(limit = 4) {
  const records = await prisma.product.findMany({
    where: { active: true, isNew: true },
    include: { variants: true },
    take: limit,
    orderBy: { createdAt: 'desc' },
  });
  return records.map(serializeProduct);
}

export async function getRelatedProducts(category, excludeId, limit = 3) {
  const records = await prisma.product.findMany({
    where: { active: true, category, NOT: { id: excludeId } },
    include: { variants: true },
    take: limit,
  });
  return records.map(serializeProduct);
}

export async function getCategories() {
  const rows = await prisma.product.findMany({
    where: { active: true },
    select: { category: true },
    distinct: ['category'],
  });
  return ['All', ...rows.map((r) => r.category)];
}
