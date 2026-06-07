import { cookies } from 'next/headers';

const GATE_COOKIE = 'vestige_access';
const GATE_TOKEN = 'vestige-prelaunch-granted';

export async function POST(request) {
  const { password } = await request.json().catch(() => ({}));
  const expected = process.env.LAUNCH_PASSWORD || 'vestige123';

  if (!password || password !== expected) {
    return Response.json({ error: 'Incorrect passcode' }, { status: 401 });
  }

  cookies().set(GATE_COOKIE, GATE_TOKEN, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 60, // 60 days — covers the pre-launch period
  });

  return Response.json({ ok: true });
}
