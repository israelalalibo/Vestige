import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import { reviewSchema } from '@/lib/validators';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId');
  if (!productId) return Response.json({ error: 'productId required' }, { status: 400 });

  const reviews = await prisma.review.findMany({
    where: { productId, status: 'APPROVED' },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return Response.json({ reviews });
}

export async function POST(request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: 'You must be signed in' }, { status: 401 });

  const parsed = reviewSchema.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message || 'Invalid input' }, { status: 400 });
  }
  const { productId, rating, title, body } = parsed.data;

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return Response.json({ error: 'Product not found' }, { status: 404 });

  try {
    const review = await prisma.review.upsert({
      where: { productId_userId: { productId, userId: user.id } },
      update: { rating, title: title || null, body, status: 'PENDING' },
      create: { productId, userId: user.id, rating, title: title || null, body, status: 'PENDING' },
    });
    return Response.json({ review }, { status: 201 });
  } catch (err) {
    console.error('Review error:', err);
    return Response.json({ error: 'Could not submit review' }, { status: 500 });
  }
}
