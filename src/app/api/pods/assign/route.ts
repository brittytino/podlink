import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth-helper';
import prisma from '@/lib/prisma';
import { assignUserToPod } from '@/lib/pod-assignment';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId, podType = 'REAL' } = await req.json();

    // Get the current user's full details including availability hours
    const currentUser = await (prisma.user.findUnique as any)({
      where: { id: userId },
      select: {
        goalType: true,
        goalDescription: true,
        goalCategory: true,
        availabilityHours: true,
        currentStreak: true,
        lastCheckIn: true,
        createdAt: true,
      },
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!currentUser.goalCategory) {
      return NextResponse.json(
        { error: 'User must have a goal category selected' },
        { status: 400 }
      );
    }

    // Use shared pod assignment utility
    const result = await assignUserToPod(
      userId,
      podType as 'REAL' | 'AI',
      currentUser
    );
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Pod assignment error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
