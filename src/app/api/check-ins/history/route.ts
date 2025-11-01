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
    const userId = searchParams.get('userId');
    const days = parseInt(searchParams.get('days') || '7');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const checkIns = await prisma.checkIn.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
        },
      },
      orderBy: { date: 'asc' },
    });

    return NextResponse.json({ checkIns });
  } catch (error) {
    console.error('Check-in history error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
