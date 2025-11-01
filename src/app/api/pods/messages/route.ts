import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth-helper';
import { prisma } from '@/lib/prisma';

async function retryDatabaseOperation<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      if (error?.code === 'P1001' || error?.message?.includes('connect')) {
        if (i < maxRetries - 1) {
          await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
          continue;
        }
      }
      throw error;
    }
  }
  throw lastError;
}

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

    const messages = await retryDatabaseOperation(() =>
      prisma.podMessage.findMany({
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
      })
    );

    const formattedMessages = messages.map((msg: { id: string; messageText: string; userId: string; createdAt: Date; user: { username: string; avatarUrl: string | null }; isCrisisResponse: boolean }) => ({
      id: msg.id,
      messageText: msg.messageText,
      userId: msg.userId,
      username: msg.user.username,
      avatarUrl: msg.user.avatarUrl,
      createdAt: msg.createdAt.toISOString(),
      isCrisisResponse: msg.isCrisisResponse,
    }));

    return NextResponse.json({ messages: formattedMessages });
  } catch (error: any) {
    console.error('Get messages error:', error);
    
    if (error?.code === 'P1001') {
      return NextResponse.json(
        { error: 'Database connection failed. Please try again.' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error?.message : undefined,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { podId, userId, messageText, isCrisisResponse, alertId } = await req.json();

    if (!podId || !userId || !messageText) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const message = await retryDatabaseOperation(() =>
      prisma.podMessage.create({
        data: {
          podId,
          userId,
          messageText,
          isCrisisResponse: isCrisisResponse || false,
          alertId: alertId || null,
        },
      })
    );

    // If crisis response, increment response count
    if (isCrisisResponse && alertId) {
      await retryDatabaseOperation(() =>
        prisma.crisisAlert.update({
          where: { id: alertId },
          data: {
            responseCount: {
              increment: 1,
            },
          },
        })
      );
    }

    return NextResponse.json({ message });
  } catch (error: any) {
    console.error('Send message error:', error);
    
    if (error?.code === 'P1001') {
      return NextResponse.json(
        { error: 'Database connection failed. Please try again.' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error?.message : undefined,
      },
      { status: 500 }
    );
  }
}
