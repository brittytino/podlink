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

    const members = await prisma.user.findMany({
      where: { 
        podId,
        isAI: false, // Exclude AI bots from member list
      },
      select: {
        id: true,
        username: true,
        fullName: true,
        displayName: true, // Anonymous name for privacy
        avatarUrl: true,
        currentStreak: true,
        lastCheckIn: true,
      },
    });

    // Map to use displayName (fallback to fullName if displayName not set)
    const anonymizedMembers = members.map((member) => ({
      ...member,
      displayName: member.displayName || member.fullName,
    }));

    const pod = await prisma.pod.findUnique({
      where: { id: podId },
      select: { name: true },
    });

    return NextResponse.json({ members: anonymizedMembers, podName: pod?.name });
  } catch (error) {
    console.error('Pod members error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
