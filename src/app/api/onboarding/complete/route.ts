import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth-helper';
import prisma from '@/lib/prisma';
import { generateAnonymousName } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      goalType,
      goalDescription,
      goalCategory,
      podType,
      availabilityMessage,
      timezone,
      availabilityHours,
    } = await req.json();

    // Get current user to check if displayName exists
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { displayName: true },
    });

    // Generate anonymous display name if not already set
    let displayName = currentUser?.displayName;
    if (!displayName) {
      const existingUsers = await prisma.user.findMany({
        select: { displayName: true },
        where: { displayName: { not: null } },
      });
      const existingNames = existingUsers
        .map((u) => u.displayName)
        .filter((n): n is string => n !== null);
      displayName = await generateAnonymousName(existingNames);
    }

    // Update user with onboarding data
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        goalType,
        goalDescription,
        goalCategory,
        availabilityMessage,
        timezone,
        availabilityHours,
        displayName, // Set anonymous name if not already set
        onboardingComplete: true,
      },
    });

    // Assign to a pod directly using shared utility
    let podId = null;
    try {
      const { assignUserToPod } = await import('@/lib/pod-assignment');
      const podTypeToUse = (podType || 'REAL') as 'REAL' | 'AI';
      
      const result = await assignUserToPod(
        user.id,
        podTypeToUse,
        {
          goalCategory: user.goalCategory,
          goalType: user.goalType,
          goalDescription: user.goalDescription,
          availabilityHours: user.availabilityHours as { start: string; end: string },
          currentStreak: user.currentStreak,
          lastCheckIn: user.lastCheckIn,
          createdAt: user.createdAt,
        }
      );
      podId = result.podId;
    } catch (error) {
      console.error('Pod assignment error:', error);
      // Continue even if pod assignment fails - user can be assigned later
    }

    return NextResponse.json({
      success: true,
      podId: podId,
    });
  } catch (error) {
    console.error('Onboarding completion error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
