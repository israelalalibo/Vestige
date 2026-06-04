import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export function auth() {
  return getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user ?? null;
}

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') return null;
  return session.user;
}
