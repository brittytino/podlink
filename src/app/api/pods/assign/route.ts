import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth-helper';
import { prisma } from '@/lib/prisma';

const podNames = [
  'Pod Alpha', 'Pod Beta', 'Pod Gamma', 'Pod Delta', 'Pod Epsilon',
  'Pod Zeta', 'Pod Eta', 'Pod Theta', 'Pod Iota', 'Pod Kappa',
];

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId } = await req.json();

    // Find users waiting for pod assignment
    const waitingUsers = await prisma.user.findMany({
      where: {
        onboardingComplete: true,
        podId: null,
      },
      orderBy: { createdAt: 'asc' },
      take: 4,
    });

    if (waitingUsers.length < 3) {
      // Not enough users for a pod yet - assign to existing pod if available
      const existingPod = await prisma.pod.findFirst({
        include: {
          members: true,
        },
        where: {
          members: {
            some: {},
          },
        },
      });

      if (existingPod && existingPod.members.length < 4) {
        await prisma.user.update({
          where: { id: userId },
          data: { podId: existingPod.id },
        });

        return NextResponse.json({ podId: existingPod.id });
      }

      return NextResponse.json(
        { error: 'Waiting for more users' },
        { status: 202 }
      );
    }

    // Create new pod
    const podCount = await prisma.pod.count();
    const podName = podNames[podCount % podNames.length] || `Pod ${podCount + 1}`;

    const pod = await prisma.pod.create({
      data: {
        name: podName,
        totalStreak: 0,
      },
    });

    // Assign users to pod
    await prisma.user.updateMany({
      where: {
        id: {
          in: waitingUsers.map((u: { id: string }) => u.id),
        },
      },
      data: {
        podId: pod.id,
      },
    });

    return NextResponse.json({ podId: pod.id });
  } catch (error) {
    console.error('Pod assignment error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
