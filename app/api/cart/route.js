import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';

// Keep only the fields the storefront cart needs, and sanitise types so a
// malformed client payload can't poison the stored cart.
function sanitizeItems(items) {
  if (!Array.isArray(items)) return [];
  return items
    .filter((i) => i && i.id && i.size && i.color)
    .slice(0, 100)
    .map((i) => ({
      id: String(i.id),
      name: String(i.name ?? ''),
      price: Number(i.price) || 0,
      image: i.image ? String(i.image) : null,
      size: String(i.size),
      color: String(i.color),
      quantity: Math.max(1, Math.min(99, Math.floor(Number(i.quantity) || 1))),
    }));
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const cart = await prisma.cart.findUnique({ where: { userId: user.id } });
  return Response.json({ items: cart?.items ?? [] });
}

export async function PUT(request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const items = sanitizeItems(body.items);

  await prisma.cart.upsert({
    where: { userId: user.id },
    update: { items },
    create: { userId: user.id, items },
  });

  return Response.json({ ok: true, items });
}
