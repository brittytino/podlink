import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export default async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const path = req.nextUrl.pathname;

  // Allow auth routes and API routes
  if (
    path.startsWith('/login') || 
    path.startsWith('/register') || 
    path.startsWith('/verify-email') ||
    path.startsWith('/api/auth')
  ) {
    return NextResponse.next();
  }

  // Require authentication for protected routes
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Get the latest onboarding status from token
  const isOnboardingComplete = (token as any).onboardingComplete;

  // Redirect to onboarding if not completed (excluding API routes and onboarding itself)
  if (
    !isOnboardingComplete &&
    path !== '/onboarding' &&
    !path.startsWith('/api')
  ) {
    return NextResponse.redirect(new URL('/onboarding', req.url));
  }

  // Redirect to dashboard if trying to access onboarding when already completed
  if (isOnboardingComplete && path === '/onboarding') {
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
