import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/session';
import { orderStatusSchema } from '@/lib/validators';

export async function PATCH(request, { params }) {
  const admin = await requireAdmin();
  if (!admin) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const parsed = orderStatusSchema.safeParse(await request.json());
  if (!parsed.success) return Response.json({ error: 'Invalid status' }, { status: 400 });

  const order = await prisma.order.update({
    where: { id: params.id },
    data: { status: parsed.data.status },
  });
  return Response.json({ order });
}
