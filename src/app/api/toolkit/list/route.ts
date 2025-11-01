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

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const items = await prisma.crisisToolkitItem.findMany({
      where: { userId },
      orderBy: { orderPosition: 'asc' },
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error('List toolkit items error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
