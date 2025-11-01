import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, title, description } = await req.json();

    const item = await prisma.crisisToolkitItem.update({
      where: { id },
      data: {
        title,
        description,
      },
    });

    return NextResponse.json({ item });
  } catch (error) {
    console.error('Update toolkit item error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
