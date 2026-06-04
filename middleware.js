import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const role = req.nextauth?.token?.role;

    // Admin area requires ADMIN role.
    if (pathname.startsWith('/admin') && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login?callbackUrl=/admin', req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      // Returning true = allowed in. A token only exists when logged in,
      // which is enough to gate /account; role is checked above for /admin.
      authorized: ({ token }) => !!token,
    },
    pages: { signIn: '/login' },
  }
);

export const config = {
  matcher: ['/admin/:path*', '/account/:path*', '/wishlist'],
};
