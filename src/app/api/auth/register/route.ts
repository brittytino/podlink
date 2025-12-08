import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { generateAnonymousName } from '@/lib/openrouter';
import { sendVerificationEmail } from '@/lib/email';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

// Verify reCAPTCHA token
async function verifyRecaptcha(token: string): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  
  if (!secretKey) {
    console.warn('reCAPTCHA secret key not configured');
    return true; // Allow in development if not configured
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${secretKey}&response=${token}`,
    });

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error('reCAPTCHA verification failed:', error);
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email, password, recaptchaToken } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Verify reCAPTCHA
    if (recaptchaToken) {
      const isValidRecaptcha = await verifyRecaptcha(recaptchaToken);
      if (!isValidRecaptcha) {
        return NextResponse.json(
          { error: 'reCAPTCHA verification failed. Please try again.' },
          { status: 400 }
        );
      }
    }

    // Rate limiting - 5 signups per IP per hour
    const clientIp = getClientIp(req.headers);
    const rateLimitResult = await checkRateLimit(clientIp, 'signup');

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: rateLimitResult.error },
        { status: 429 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate anonymous display name and username via Gemini
    const existingUsers = await prisma.user.findMany({
      select: { displayName: true, username: true },
      where: { displayName: { not: null } },
    });
    const existingNames = existingUsers
      .map((u) => u.displayName)
      .filter((n): n is string => n !== null);
    const existingUsernames = existingUsers
      .map((u) => u.username)
      .filter((n): n is string => n !== null);

    // Generate display name
    console.log('🤖 Generating anonymous display name...');
    let displayName: string;
    try {
      displayName = await generateAnonymousName(existingNames);
      console.log('✅ Generated display name:', displayName);
    } catch (error) {
      console.error('❌ Failed to generate AI name, using fallback:', error);
      // Fallback to a simple random name if AI fails
      displayName = `User${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    }

    // Generate unique username from display name
    let username = displayName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    let usernameCounter = 1;
    let finalUsername = username;
    
    // Ensure username is unique
    while (existingUsernames.includes(finalUsername)) {
      finalUsername = `${username}_${usernameCounter}`;
      usernameCounter++;
    }
    
    console.log('👤 Final username:', finalUsername);

    // Create user with generated username
    const user = await prisma.user.create({
      data: {
        fullName: displayName, // Use displayName as fullName for anonymous platform
        displayName, // Anonymous name for privacy
        username: finalUsername,
        email: email.toLowerCase(),
        password: hashedPassword,
        timezone: 'UTC',
        availabilityHours: { start: '09:00', end: '22:00' },
        // Don't set goal values - let onboarding handle this
        onboardingComplete: false,
        // Email verification fields
        emailVerified: false,
        verificationToken,
        verificationTokenExpiry,
      } as any,
    });

    // Send verification email
    console.log('📧 Preparing to send verification email...');
    const emailResult = await sendVerificationEmail(
      user.email,
      user.displayName || user.username,
      verificationToken
    );

    if (!emailResult.success) {
      console.error('❌ Failed to send verification email:', emailResult.error);
      // Don't fail registration if email fails, but log the error clearly
      console.error('⚠️ User registered but email not sent. User can request resend.');
    } else {
      console.log('✅ Verification email sent successfully to:', user.email);
    }

    return NextResponse.json(
      { 
        user: { id: user.id, email: user.email },
        message: emailResult.success 
          ? 'Registration successful! Please check your email to verify your account.'
          : 'Registration successful! However, we could not send the verification email. Please use the resend option.',
        emailSent: emailResult.success,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
