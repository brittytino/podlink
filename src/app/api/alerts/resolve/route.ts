import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth-helper';
import prisma from '@/lib/prisma';

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { alertId } = await req.json();

    if (!alertId) {
      return NextResponse.json({ error: 'Alert ID required' }, { status: 400 });
    }

    // Verify the alert exists and get podId for socket emission
    const existingAlert = await prisma.crisisAlert.findUnique({
      where: { id: alertId },
      select: { podId: true, status: true },
    });

    if (!existingAlert) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
    }

    if (existingAlert.status === 'RESOLVED') {
      return NextResponse.json({ error: 'Alert already resolved' }, { status: 400 });
    }

    const alert = await prisma.crisisAlert.update({
      where: { id: alertId },
      data: {
        status: 'RESOLVED',
        resolvedAt: new Date(),
      },
      include: {
        pod: {
          select: { id: true },
        },
      },
    });

    return NextResponse.json({ alert });
  } catch (error: any) {
    console.error('Resolve alert error:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
    }
    return NextResponse.json(
      { error: 'Internal server error', message: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    );
  }
}
