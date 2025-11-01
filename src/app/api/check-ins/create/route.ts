import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth-helper';
import { prisma } from '@/lib/prisma';

async function retryDatabaseOperation<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      // If it's a connection error, retry
      if (error?.code === 'P1001' || error?.message?.includes('connect')) {
        if (i < maxRetries - 1) {
          await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
          continue;
        }
      }
      throw error;
    }
  }
  throw lastError;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId, stayedOnTrack } = await req.json();

    if (!userId || typeof stayedOnTrack !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    // Check if already checked in today with retry
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingCheckIn = await retryDatabaseOperation(() =>
      prisma.checkIn.findFirst({
        where: {
          userId,
          date: {
            gte: today,
          },
        },
      })
    );

    if (existingCheckIn) {
      return NextResponse.json(
        { error: 'Already checked in today' },
        { status: 400 }
      );
    }

    // Create check-in with retry
    const checkIn = await retryDatabaseOperation(() =>
      prisma.checkIn.create({
        data: {
          userId,
          stayedOnTrack,
          date: new Date(),
        },
      })
    );

    // Update user streak with retry
    const user = await retryDatabaseOperation(() =>
      prisma.user.findUnique({
        where: { id: userId },
        select: { currentStreak: true, podId: true },
      })
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const newStreak = stayedOnTrack ? (user.currentStreak || 0) + 1 : 0;

    await retryDatabaseOperation(() =>
      prisma.user.update({
        where: { id: userId },
        data: {
          currentStreak: newStreak,
          lastCheckIn: new Date(),
        },
      })
    );

    // Update pod total streak with retry
    if (user.podId) {
      const podId = user.podId; // Type narrowing
      const podMembers = await retryDatabaseOperation(() =>
        prisma.user.findMany({
          where: { podId },
          select: { currentStreak: true },
        })
      );

      const totalStreak = podMembers.reduce(
        (sum: number, member: { currentStreak: number }) => sum + member.currentStreak,
        0
      );

      await retryDatabaseOperation(() =>
        prisma.pod.update({
          where: { id: podId },
          data: { totalStreak },
        })
      );
    }

    return NextResponse.json({ checkIn, newStreak });
  } catch (error: any) {
    console.error('Check-in error:', error);
    
    // Provide more specific error messages
    if (error?.code === 'P1001') {
      return NextResponse.json(
        { error: 'Database connection failed. Please try again.' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error?.message : undefined,
      },
      { status: 500 }
    );
  }
}
