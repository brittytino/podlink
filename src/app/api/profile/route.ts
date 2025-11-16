import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth-helper';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        fullName: true,
        username: true,
        email: true,
        avatarUrl: true,
        goalType: true,
        goalDescription: true,
        goalCategory: true,
        timezone: true,
        availabilityHours: true,
        currentStreak: true,
        lastCheckIn: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Note: gender field will be available after running migration
    // For now, we'll access it directly from the full user object
    const fullUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    return NextResponse.json({ 
      user: {
        ...user,
        gender: (fullUser as any)?.gender || null,
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
