import { createHash } from 'crypto';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

const hash = (t) => createHash('sha256').update(t).digest('hex');

export async function POST(request) {
  try {
    const { token, password } = await request.json().catch(() => ({}));
    if (!token || !password || password.length < 8) {
      return Response.json({ error: 'Invalid request. Password must be at least 8 characters.' }, { status: 400 });
    }

    const record = await prisma.passwordResetToken.findUnique({ where: { token: hash(token) } });
    if (!record || record.expiresAt < new Date()) {
      return Response.json({ error: 'This reset link is invalid or has expired.' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.$transaction([
      prisma.user.update({ where: { email: record.email }, data: { passwordHash } }),
      prisma.passwordResetToken.deleteMany({ where: { email: record.email } }),
    ]);

    return Response.json({ ok: true });
  } catch (err) {
    console.error('reset-password error:', err);
    return Response.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
