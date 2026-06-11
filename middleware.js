import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// ---- Pre-launch passcode gate ----
// Enabled by default. After launch, set LAUNCH_GATE_OPEN="true" in the
// environment (Vercel) to disable the gate and open the site to everyone.
const GATE_COOKIE = 'vestige_access';
const GATE_TOKEN = 'vestige-prelaunch-granted';

function gateEnabled() {
  return process.env.LAUNCH_GATE_OPEN !== 'true';
}

// Paths reachable without the passcode (the gate page, unlock endpoint,
// auth session calls, and pre-launch newsletter signup).
function isAllowedWhileLocked(pathname) {
  return (
    pathname === '/coming-soon' ||
    pathname === '/forgot-password' ||
    pathname === '/reset-password' ||
    pathname.startsWith('/api/unlock') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/api/newsletter') ||
    pathname.startsWith('/api/cron')
  );
}

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // 1) Launch gate
  if (gateEnabled()) {
    const unlocked = req.cookies.get(GATE_COOKIE)?.value === GATE_TOKEN;

    if (!unlocked && !isAllowedWhileLocked(pathname)) {
      const url = req.nextUrl.clone();
      url.pathname = '/coming-soon';
      url.search = '';
      return NextResponse.redirect(url);
    }

    // Already unlocked but landing on the gate page → send to home.
    if (unlocked && pathname === '/coming-soon') {
      const url = req.nextUrl.clone();
      url.pathname = '/';
      url.search = '';
      return NextResponse.redirect(url);
    }
  }

  // 2) Auth protection (unchanged behaviour for /admin, /account, /wishlist)
  const needsAuth =
    pathname.startsWith('/admin') || pathname.startsWith('/account') || pathname === '/wishlist';

  if (needsAuth) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }
    if (pathname.startsWith('/admin') && token.role !== 'ADMIN') {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('callbackUrl', '/admin');
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Run on everything except Next internals and static files.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf)$).*)'],
};
