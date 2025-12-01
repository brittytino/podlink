import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth-helper';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const podId = searchParams.get('podId');
    const userId = session.user.id;

    if (!podId) {
      return NextResponse.json({ error: 'Pod ID required' }, { status: 400 });
    }

    // Get alerts but exclude the ones created by the current user
    const alerts = await prisma.crisisAlert.findMany({
      where: { 
        podId,
        userId: {
          not: userId, // Exclude alerts created by the current user
        },
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            displayName: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return NextResponse.json({ alerts });
  } catch (error) {
    console.error('List alerts error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
