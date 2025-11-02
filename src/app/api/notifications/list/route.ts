import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth-helper';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's podId
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { podId: true },
    });

    if (!user?.podId) {
      return NextResponse.json({ notifications: [] });
    }

    // Get active alerts in user's pod (excluding alerts created by the user)
    const alerts = await prisma.crisisAlert.findMany({
      where: {
        podId: user.podId,
        status: 'ACTIVE',
        userId: { not: session.user.id },
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return NextResponse.json({ notifications: alerts });
  } catch (error) {
    console.error('Get notifications error:', error);
    return NextResponse.json({ notifications: [] });
  }
}

