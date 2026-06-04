import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/session';
import { productSchema } from '@/lib/validators';

export async function GET(_request, { params }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { variants: true },
  });
  if (!product) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json({ product });
}

export async function PUT(request, { params }) {
  const admin = await requireAdmin();
  if (!admin) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const parsed = productSchema.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message || 'Invalid input' }, { status: 400 });
  }
  const { variants, ...data } = parsed.data;

  // Replace variants wholesale: upsert provided, delete the rest.
  const existing = await prisma.variant.findMany({ where: { productId: params.id } });
  const keepKeys = new Set(variants.map((v) => `${v.size}|${v.color}`));

  await prisma.$transaction(async (tx) => {
    await tx.product.update({ where: { id: params.id }, data });

    // Delete variants no longer present.
    const toDelete = existing.filter((v) => !keepKeys.has(`${v.size}|${v.color}`));
    if (toDelete.length) {
      await tx.variant.deleteMany({ where: { id: { in: toDelete.map((v) => v.id) } } });
    }

    for (const v of variants) {
      const sku = v.sku || `${data.slug.slice(0, 6).toUpperCase()}-${v.size}-${v.color.slice(0, 4).toUpperCase()}`;
      await tx.variant.upsert({
        where: { productId_size_color: { productId: params.id, size: v.size, color: v.color } },
        update: { stock: v.stock, sku },
        create: { productId: params.id, size: v.size, color: v.color, stock: v.stock, sku },
      });
    }
  });

  const product = await prisma.product.findUnique({ where: { id: params.id }, include: { variants: true } });
  return Response.json({ product });
}

export async function DELETE(_request, { params }) {
  const admin = await requireAdmin();
  if (!admin) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  await prisma.product.delete({ where: { id: params.id } });
  return Response.json({ ok: true });
}
