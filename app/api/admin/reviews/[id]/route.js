import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/session';

export async function PATCH(request, { params }) {
  const admin = await requireAdmin();
  if (!admin) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { status } = await request.json();
  if (!['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
    return Response.json({ error: 'Invalid status' }, { status: 400 });
  }
  const review = await prisma.review.update({ where: { id: params.id }, data: { status } });
  return Response.json({ review });
}

export async function DELETE(_request, { params }) {
  const admin = await requireAdmin();
  if (!admin) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  await prisma.review.delete({ where: { id: params.id } });
  return Response.json({ ok: true });
}
