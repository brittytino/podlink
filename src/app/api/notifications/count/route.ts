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
      return NextResponse.json({ count: 0 });
    }

    // Count active alerts in user's pod (excluding alerts created by the user)
    const activeAlertsCount = await prisma.crisisAlert.count({
      where: {
        podId: user.podId,
        status: 'ACTIVE',
        userId: { not: session.user.id }, // Exclude alerts created by the user
      },
    });

    return NextResponse.json({ count: activeAlertsCount });
  } catch (error) {
    console.error('Get notifications count error:', error);
    return NextResponse.json({ count: 0 });
  }
}

