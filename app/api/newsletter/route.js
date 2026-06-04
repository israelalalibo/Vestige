import { prisma } from '@/lib/prisma';
import { newsletterSchema } from '@/lib/validators';

export async function POST(request) {
  const parsed = newsletterSchema.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message || 'Invalid email' }, { status: 400 });
  }
  const { email } = parsed.data;

  await prisma.newsletterSubscriber.upsert({
    where: { email },
    update: {},
    create: { email },
  });
  return Response.json({ ok: true });
}
