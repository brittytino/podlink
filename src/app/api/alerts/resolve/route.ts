import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth-helper';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { alertId } = await req.json();

    const alert = await prisma.crisisAlert.update({
      where: { id: alertId },
      data: {
        status: 'RESOLVED',
        resolvedAt: new Date(),
      },
    });

    return NextResponse.json({ alert });
  } catch (error) {
    console.error('Resolve alert error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
