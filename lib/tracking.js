import { cookies } from 'next/headers';
import { randomUUID } from 'crypto';

export const VID_COOKIE = 'vestige_vid';

// Returns the current visitor id from the cookie, or null if not set.
export function getVisitorId() {
  return cookies().get(VID_COOKIE)?.value || null;
}

// Returns the visitor id, generating + setting the cookie if absent.
// Must be called from a Route Handler / Server Action (where cookies are mutable).
export function ensureVisitorId() {
  const jar = cookies();
  let vid = jar.get(VID_COOKIE)?.value;
  if (!vid) {
    vid = randomUUID();
    jar.set(VID_COOKIE, vid, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });
  }
  return vid;
}
