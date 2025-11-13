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

    if (!podId) {
      return NextResponse.json({ error: 'Pod ID required' }, { status: 400 });
    }

    const alerts = await prisma.crisisAlert.findMany({
      where: { podId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            displayName: true, // Anonymous name for privacy
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
