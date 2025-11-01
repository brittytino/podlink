import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth-helper';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const userPodId = searchParams.get('userPodId');

    // Get top 10 pods
    const topPods = await prisma.pod.findMany({
      include: {
        members: {
          select: { id: true },
        },
      },
      orderBy: { totalStreak: 'desc' },
      take: 10,
    });

    const formattedPods = topPods.map((pod: { id: string; name: string; totalStreak: number; members: { id: string }[] }) => ({
      id: pod.id,
      name: pod.name,
      totalStreak: pod.totalStreak,
      memberCount: pod.members.length,
      isUserPod: pod.id === userPodId,
    }));

    // If user's pod not in top 10, fetch it separately
    let userPod = null;
    if (userPodId && !formattedPods.some((p: { isUserPod: boolean }) => p.isUserPod)) {
      const pod = await prisma.pod.findUnique({
        where: { id: userPodId },
        include: {
          members: {
            select: { id: true },
          },
        },
      });

      if (pod) {
        // Calculate rank
        const higherPods = await prisma.pod.count({
          where: {
            totalStreak: {
              gt: pod.totalStreak,
            },
          },
        });

        userPod = {
          id: pod.id,
          name: pod.name,
          totalStreak: pod.totalStreak,
          memberCount: pod.members.length,
          rank: higherPods + 1,
          isUserPod: true,
        };
      }
    }

    const totalPods = await prisma.pod.count();

    return NextResponse.json({ pods: formattedPods, userPod, totalPods });
  } catch (error) {
    console.error('Leaderboard error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
