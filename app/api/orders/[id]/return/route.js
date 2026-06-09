import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';

export async function POST(request, { params }) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { reason } = await request.json().catch(() => ({}));
  if (!reason || !reason.trim()) {
    return Response.json({ error: 'Please provide a reason for the return' }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { returns: true },
  });
  if (!order || order.userId !== user.id) {
    return Response.json({ error: 'Order not found' }, { status: 404 });
  }
  if (order.status !== 'DELIVERED') {
    return Response.json({ error: 'Only delivered orders can be returned' }, { status: 409 });
  }
  if (order.returns.length > 0) {
    return Response.json({ error: 'A return has already been requested for this order' }, { status: 409 });
  }

  const ret = await prisma.returnRequest.create({
    data: {
      orderId: order.id,
      userId: user.id,
      reason: reason.trim().slice(0, 1000),
      status: 'REQUESTED',
    },
  });

  return Response.json({ ok: true, return: ret }, { status: 201 });
}
