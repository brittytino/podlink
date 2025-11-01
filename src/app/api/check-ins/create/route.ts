import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth-helper';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId, stayedOnTrack } = await req.json();

    // Check if already checked in today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingCheckIn = await prisma.checkIn.findFirst({
      where: {
        userId,
        date: {
          gte: today,
        },
      },
    });

    if (existingCheckIn) {
      return NextResponse.json(
        { error: 'Already checked in today' },
        { status: 400 }
      );
    }

    // Create check-in
    const checkIn = await prisma.checkIn.create({
      data: {
        userId,
        stayedOnTrack,
        date: new Date(),
      },
    });

    // Update user streak
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { currentStreak: true, podId: true },
    });

    const newStreak = stayedOnTrack ? (user?.currentStreak || 0) + 1 : 0;

    await prisma.user.update({
      where: { id: userId },
      data: {
        currentStreak: newStreak,
        lastCheckIn: new Date(),
      },
    });

    // Update pod total streak
    if (user?.podId) {
      const podMembers = await prisma.user.findMany({
        where: { podId: user.podId },
        select: { currentStreak: true },
      });

      const totalStreak = podMembers.reduce(
        (sum: number, member: { currentStreak: number }) => sum + member.currentStreak,
        0
      );

      await prisma.pod.update({
        where: { id: user.podId },
        data: { totalStreak },
      });
    }

    return NextResponse.json({ checkIn, newStreak });
  } catch (error) {
    console.error('Check-in error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
