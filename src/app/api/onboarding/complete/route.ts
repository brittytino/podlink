import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth-helper';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { goalType, goalDescription, timezone, availabilityHours } =
      await req.json();

    // Update user with onboarding data
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        goalType,
        goalDescription,
        timezone,
        availabilityHours,
        onboardingComplete: true,
      },
    });

    // Try to assign to a pod
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/pods/assign`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      }
    );

    const data = await response.json();

    return NextResponse.json({
      success: true,
      podId: data.podId || null,
    });
  } catch (error) {
    console.error('Onboarding completion error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
