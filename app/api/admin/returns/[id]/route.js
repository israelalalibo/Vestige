import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/session';

const VALID = ['REQUESTED', 'APPROVED', 'REJECTED', 'RECEIVED', 'REFUNDED'];

export async function PATCH(request, { params }) {
  const admin = await requireAdmin();
  if (!admin) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { status } = await request.json().catch(() => ({}));
  if (!VALID.includes(status)) return Response.json({ error: 'Invalid status' }, { status: 400 });

  const ret = await prisma.returnRequest.update({
    where: { id: params.id },
    data: { status },
  });

  // Marking a return refunded also refunds the underlying order.
  if (status === 'REFUNDED') {
    await prisma.order.update({ where: { id: ret.orderId }, data: { status: 'REFUNDED' } });
  }

  return Response.json({ ok: true, return: ret });
}
