import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const items = await prisma.wishlistItem.findMany({
    where: { userId: user.id },
    select: { productId: true },
  });
  return Response.json({ productIds: items.map((i) => i.productId) });
}

export async function POST(request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { productId } = await request.json();
  if (!productId) return Response.json({ error: 'productId required' }, { status: 400 });

  await prisma.wishlistItem.upsert({
    where: { userId_productId: { userId: user.id, productId } },
    update: {},
    create: { userId: user.id, productId },
  });
  return Response.json({ ok: true });
}

export async function DELETE(request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId');
  if (!productId) return Response.json({ error: 'productId required' }, { status: 400 });

  await prisma.wishlistItem.deleteMany({ where: { userId: user.id, productId } });
  return Response.json({ ok: true });
}
