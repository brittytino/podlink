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
    const podId = searchParams.get('podId');

    if (!podId) {
      return NextResponse.json({ error: 'Pod ID required' }, { status: 400 });
    }

    const members = await prisma.user.findMany({
      where: { podId },
      select: {
        id: true,
        username: true,
        fullName: true,
        avatarUrl: true,
        currentStreak: true,
        lastCheckIn: true,
      },
    });

    const pod = await prisma.pod.findUnique({
      where: { id: podId },
      select: { name: true },
    });

    return NextResponse.json({ members, podName: pod?.name });
  } catch (error) {
    console.error('Pod members error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
