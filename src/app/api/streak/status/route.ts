import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth-helper';
import { getStreakStatus, getRestoreHistory } from '@/lib/streak-manager';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const streakStatus = await getStreakStatus(session.user.id);
    const restoreHistory = await getRestoreHistory(session.user.id);

    return NextResponse.json({
      ...streakStatus,
      restoreHistory: restoreHistory.restores,
      restoresUsedThisMonth: restoreHistory.restoresUsedThisMonth,
    });
  } catch (error) {
    console.error('Error fetching streak status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch streak status' },
      { status: 500 }
    );
  }
}
