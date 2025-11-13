import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth-helper';
import prisma from '@/lib/prisma';

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { fullName, username, goalDescription, timezone, availabilityHours } =
      await req.json();

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        fullName,
        username,
        goalDescription,
        timezone,
        availabilityHours,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
