import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Verify email with token
 * GET /api/auth/verify-email?token=xxx
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      );
    }

    // Find user with this verification token
    const user = await prisma.user.findUnique({
      where: { verificationToken: token },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }

    // Check if token has expired (24 hours)
    if (user.verificationTokenExpiry && user.verificationTokenExpiry < new Date()) {
      return NextResponse.json(
        { error: 'Verification token has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Check if already verified
    if (user.emailVerified) {
      // Redirect to login with success message
      return NextResponse.redirect(
        new URL('/login?verified=true&message=Email already verified', request.url)
      );
    }

    // Verify the email
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null,
        verificationTokenExpiry: null,
      },
    });

    console.log('✅ Email verified successfully for user:', user.email);

    // Redirect to login page with success message
    return NextResponse.redirect(
      new URL('/login?verified=true&message=Email verified successfully! You can now login.', request.url)
    );
  } catch (error: any) {
    console.error('❌ Email verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify email. Please try again.' },
      { status: 500 }
    );
  }
}
