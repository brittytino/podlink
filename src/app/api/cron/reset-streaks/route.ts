import { NextResponse } from 'next/server';
import { checkAndBreakExpiredStreaks } from '@/lib/streak-manager';

export async function GET(request: Request) {
  try {
    // Add basic security - check for cron secret
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || 'dev-secret';
    
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await checkAndBreakExpiredStreaks();
    
    return NextResponse.json({
      success: true,
      brokenStreaks: result.brokenStreaks,
      usersAffected: result.usersAffected.length,
      message: `Reset ${result.brokenStreaks} streak(s)`,
    });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { error: 'Failed to reset streaks' },
      { status: 500 }
    );
  }
}

// Allow POST as well for manual triggers
export async function POST(request: Request) {
  return GET(request);
}
