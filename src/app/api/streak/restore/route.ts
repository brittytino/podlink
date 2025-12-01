import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth-helper';
import { useStreakRestore } from '@/lib/streak-manager';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { date } = body;

    const restoreDate = date ? new Date(date) : undefined;

    // Use streak restore
    const result = await useStreakRestore(session.user.id, restoreDate);

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      newStreak: result.newStreak,
      restoresRemaining: result.restoresRemaining,
    });
  } catch (error) {
    console.error('Error using streak restore:', error);
    return NextResponse.json(
      { error: 'Failed to use streak restore' },
      { status: 500 }
    );
  }
}
