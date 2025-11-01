import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Redirect to onboarding if not completed
    if (
      token &&
      !token.onboardingComplete &&
      path !== '/onboarding' &&
      !path.startsWith('/api')
    ) {
      return NextResponse.redirect(new URL('/onboarding', req.url));
    }

    // Redirect to dashboard if trying to access onboarding when already completed
    if (token && token.onboardingComplete && path === '/onboarding') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        
        // Allow auth routes
        if (path.startsWith('/login') || path.startsWith('/register')) {
          return true;
        }

        // Require token for protected routes
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/onboarding/:path*',
    '/pod/:path*',
    '/crisis-toolkit/:path*',
    '/leaderboard/:path*',
    '/profile/:path*',
  ],
};
