import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendVerificationEmail } from '@/lib/email';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import crypto from 'crypto';

/**
 * Resend verification email
 * POST /api/auth/resend-verification
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Rate limiting - 3 resends per hour per IP
    const clientIp = getClientIp(request.headers);
    const rateLimitResult = await checkRateLimit(clientIp, 'verification');

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: rateLimitResult.error },
        { status: 429 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // Don't reveal if email exists or not
      return NextResponse.json(
        { message: 'If an account exists with this email, a verification link has been sent.' },
        { status: 200 }
      );
    }

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { error: 'Email is already verified. You can login now.' },
        { status: 400 }
      );
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Update user with new token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken,
        verificationTokenExpiry,
      },
    });

    // Send verification email
    console.log('📧 Resending verification email to:', user.email);
    const emailResult = await sendVerificationEmail(
      user.email,
      user.displayName || user.username,
      verificationToken
    );

    if (!emailResult.success) {
      console.error('❌ Failed to resend verification email:', emailResult.error);
      return NextResponse.json(
        { error: 'Failed to send verification email. Please try again later.' },
        { status: 500 }
      );
    }

    console.log('✅ Verification email resent successfully');
    return NextResponse.json(
      { 
        message: 'Verification email sent successfully. Please check your inbox.',
        remainingAttempts: rateLimitResult.remainingPoints,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('❌ Resend verification error:', error);
    return NextResponse.json(
      { error: 'Failed to resend verification email' },
      { status: 500 }
    );
  }
}
