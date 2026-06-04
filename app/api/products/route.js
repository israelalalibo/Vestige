import { prisma } from '@/lib/prisma';
import { getProducts } from '@/lib/products';
import { requireAdmin } from '@/lib/session';
import { productSchema } from '@/lib/validators';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const result = await getProducts({
    q: searchParams.get('q') || undefined,
    category: searchParams.get('category') || undefined,
    sort: searchParams.get('sort') || undefined,
    page: Number(searchParams.get('page')) || 1,
    perPage: Number(searchParams.get('perPage')) || 12,
  });
  return Response.json(result);
}

export async function POST(request) {
  const admin = await requireAdmin();
  if (!admin) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const parsed = productSchema.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message || 'Invalid input' }, { status: 400 });
  }
  const { variants, ...data } = parsed.data;

  const exists = await prisma.product.findUnique({ where: { slug: data.slug } });
  if (exists) return Response.json({ error: 'A product with this slug already exists' }, { status: 409 });

  const product = await prisma.product.create({
    data: {
      ...data,
      variants: {
        create: variants.map((v) => ({
          size: v.size,
          color: v.color,
          stock: v.stock,
          sku: v.sku || `${data.slug.slice(0, 6).toUpperCase()}-${v.size}-${v.color.slice(0, 4).toUpperCase()}`,
        })),
      },
    },
    include: { variants: true },
  });

  return Response.json({ product }, { status: 201 });
}
