import { randomBytes, createHash } from 'crypto';
import { prisma } from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/email';

const hash = (t) => createHash('sha256').update(t).digest('hex');

export async function POST(request) {
  try {
    const { email } = await request.json().catch(() => ({}));
    const normalized = (email || '').toLowerCase().trim();

    if (normalized) {
      const user = await prisma.user.findUnique({ where: { email: normalized } });
      // Only send to accounts that have a password (not OAuth-only).
      if (user && user.passwordHash) {
        const raw = randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        // Replace any existing tokens for this email.
        await prisma.passwordResetToken.deleteMany({ where: { email: normalized } });
        await prisma.passwordResetToken.create({ data: { email: normalized, token: hash(raw), expiresAt } });

        const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        await sendPasswordResetEmail(normalized, `${base}/reset-password?token=${raw}`);
      }
    }

    // Always respond the same way (don't reveal whether an account exists).
    return Response.json({ ok: true });
  } catch (err) {
    console.error('forgot-password error:', err);
    return Response.json({ ok: true });
  }
}
