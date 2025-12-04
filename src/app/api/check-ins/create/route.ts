import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth-helper';
import { processCheckIn, getStreakStatus } from '@/lib/streak-manager';
import { emitToUser } from '@/lib/socket-emit';
import prisma from '@/lib/prisma';

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

    // Verify user is checking in for themselves
    if (userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Process the check-in using the streak manager
    const result = await processCheckIn(userId, stayedOnTrack);

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }

    // Get updated streak status
    const streakStatus = await getStreakStatus(userId);

    // Emit streak update event via socket
    if (result.newStreak !== undefined) {
      await emitToUser(userId, 'streak-updated', {
        userId,
        newStreak: result.newStreak,
      });
      
      await emitToUser(userId, 'check-in-complete', {
        userId,
        streak: result.newStreak,
      });
    }

    // Update pod total streak (sum of all members' streaks)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { podId: true },
    });

    if (user?.podId) {
      // Calculate total streak for the pod
      const podMembers = await prisma.user.findMany({
        where: { podId: user.podId },
        select: { currentStreak: true },
      });

      const totalStreak = podMembers.reduce((sum, member) => sum + member.currentStreak, 0);

      // Update pod's total streak
      await prisma.pod.update({
        where: { id: user.podId },
        data: { totalStreak },
      });
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      newStreak: result.newStreak,
      streakBroken: result.streakBroken,
      restoresRemaining: streakStatus.restoresRemaining,
      canUseRestore: streakStatus.canUseRestore && result.streakBroken,
    });
  } catch (error) {
    console.error('Error creating check-in:', error);
    return NextResponse.json(
      { error: 'Failed to create check-in' },
      { status: 500 }
    );
  }
}
