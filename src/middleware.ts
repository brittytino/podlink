import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export default async function middleware(req: NextRequest) {
  const session = await auth();
  const path = req.nextUrl.pathname;

  // Allow auth routes and API routes
  if (path.startsWith('/login') || path.startsWith('/register') || path.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Require authentication for protected routes
  if (!session?.user) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Check localStorage as backup for onboarding completion (for client-side routing)
  // Server-side: rely on session, but client can also check localStorage
  const onboardingComplete = session.user.onboardingComplete;

  // Redirect to onboarding if not completed
  if (
    !onboardingComplete &&
    path !== '/onboarding' &&
    !path.startsWith('/api')
  ) {
    return NextResponse.redirect(new URL('/onboarding', req.url));
  }

  // Redirect to dashboard if trying to access onboarding when already completed
  if (onboardingComplete && path === '/onboarding') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

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
