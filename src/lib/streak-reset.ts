import { prisma } from './prisma';

/**
 * Resets streaks for users who didn't check in today
 * Should be run daily via cron job
 */
export async function resetInactiveStreaks() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Find all users with current streak > 0
    const usersWithStreak = await prisma.user.findMany({
      where: {
        currentStreak: {
          gt: 0,
        },
      },
      select: {
        id: true,
        lastCheckIn: true,
        currentStreak: true,
      },
    });

    const usersToReset = usersWithStreak.filter((user) => {
      if (!user.lastCheckIn) return true;
      
      const lastCheckIn = new Date(user.lastCheckIn);
      lastCheckIn.setHours(0, 0, 0, 0);
      
      // If last check-in was not yesterday or today, reset streak
      return lastCheckIn < yesterday;
    });

    if (usersToReset.length > 0) {
      await prisma.user.updateMany({
        where: {
          id: {
            in: usersToReset.map((u) => u.id),
          },
        },
        data: {
          currentStreak: 0,
        },
      });

      console.log(`Reset streaks for ${usersToReset.length} users`);
    }

    return {
      success: true,
      resetCount: usersToReset.length,
    };
  } catch (error) {
    console.error('Error resetting streaks:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
