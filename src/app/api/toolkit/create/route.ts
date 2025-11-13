import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth-helper';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description } = await req.json();
    const userId = session.user.id;

    // Get current max order position
    const maxOrder = await prisma.crisisToolkitItem.findFirst({
      where: { userId },
      orderBy: { orderPosition: 'desc' },
      select: { orderPosition: true },
    });

    const item = await prisma.crisisToolkitItem.create({
      data: {
        userId,
        title,
        description,
        orderPosition: (maxOrder?.orderPosition || 0) + 1,
      },
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    console.error('Create toolkit item error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
