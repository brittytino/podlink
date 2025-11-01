import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const podId = searchParams.get('podId');

    if (!podId) {
      return NextResponse.json({ error: 'Pod ID required' }, { status: 400 });
    }

    const messages = await prisma.podMessage.findMany({
      where: { podId },
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
      orderBy: { createdAt: 'asc' },
      take: 50,
    });

    const formattedMessages = messages.map((msg) => ({
      id: msg.id,
      messageText: msg.messageText,
      userId: msg.userId,
      username: msg.user.username,
      avatarUrl: msg.user.avatarUrl,
      createdAt: msg.createdAt.toISOString(),
      isCrisisResponse: msg.isCrisisResponse,
    }));

    return NextResponse.json({ messages: formattedMessages });
  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { podId, userId, messageText, isCrisisResponse, alertId } = await req.json();

    const message = await prisma.podMessage.create({
      data: {
        podId,
        userId,
        messageText,
        isCrisisResponse: isCrisisResponse || false,
        alertId: alertId || null,
      },
    });

    // If crisis response, increment response count
    if (isCrisisResponse && alertId) {
      await prisma.crisisAlert.update({
        where: { id: alertId },
        data: {
          responseCount: {
            increment: 1,
          },
        },
      });
    }

    return NextResponse.json({ message });
  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
