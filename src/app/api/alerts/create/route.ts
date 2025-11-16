import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth-helper';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId, podId, message } = await req.json();

    // Verify user belongs to the pod
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { podId: true },
    });

    if (user?.podId !== podId) {
      return NextResponse.json({ error: 'Invalid pod' }, { status: 403 });
    }

    // Create crisis alert
    const alert = await prisma.crisisAlert.create({
      data: {
        userId,
        podId,
        message: message || null,
        status: 'ACTIVE',
        responseCount: 0,
      },
      include: {
        user: {
          select: {
            username: true,
            fullName: true,
            displayName: true, // Anonymous name for privacy
          },
        },
      },
    });

    return NextResponse.json({ alert }, { status: 201 });
  } catch (error) {
    console.error('Create alert error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
