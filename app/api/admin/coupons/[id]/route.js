import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/session';

export async function PATCH(request, { params }) {
  const admin = await requireAdmin();
  if (!admin) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { active } = await request.json();
  const coupon = await prisma.coupon.update({
    where: { id: params.id },
    data: { active: !!active },
  });
  return Response.json({ coupon });
}

export async function DELETE(_request, { params }) {
  const admin = await requireAdmin();
  if (!admin) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  await prisma.coupon.delete({ where: { id: params.id } });
  return Response.json({ ok: true });
}
