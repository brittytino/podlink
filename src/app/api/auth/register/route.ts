import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { generateAnonymousName } from '@/lib/openrouter';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

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
    const displayName = await generateAnonymousName(existingNames);

    // Generate unique username from display name
    let username = displayName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    let usernameCounter = 1;
    let finalUsername = username;
    
    // Ensure username is unique
    while (existingUsernames.includes(finalUsername)) {
      finalUsername = `${username}_${usernameCounter}`;
      usernameCounter++;
    }

    // Create user with generated username
    const user = await prisma.user.create({
      data: {
        fullName: displayName, // Use displayName as fullName for anonymous platform
        displayName, // Anonymous name for privacy
        username: finalUsername,
        email,
        password: hashedPassword,
        timezone: 'UTC',
        availabilityHours: { start: '09:00', end: '22:00' },
        // Don't set goal values - let onboarding handle this
        onboardingComplete: false,
      } as any,
    });

    return NextResponse.json(
      { user: { id: user.id, email: user.email } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
