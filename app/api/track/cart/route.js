import { prisma } from '@/lib/prisma';
import { ensureVisitorId } from '@/lib/tracking';
import { getCurrentUser } from '@/lib/session';

export async function POST(request) {
  try {
    const { productId, name, priceCents, quantity } = await request.json().catch(() => ({}));
    if (!name || !priceCents) return Response.json({ ok: false }, { status: 200 });

    const visitorId = ensureVisitorId();
    const user = await getCurrentUser();

    await prisma.cartEvent.create({
      data: {
        visitorId,
        userId: user?.id || null,
        productId: productId || null,
        name: String(name).slice(0, 200),
        priceCents: Math.max(0, Math.round(Number(priceCents) || 0)),
        quantity: Math.max(1, Math.min(99, Math.floor(Number(quantity) || 1))),
      },
    });

    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ ok: false }, { status: 200 });
  }
}
