import { prisma } from './prisma';

const MAX_RESTORES_PER_MONTH = 3;
const MAX_GAP_DAYS = 0; // No gap allowed - must check in every consecutive day

interface StreakStatus {
  currentStreak: number;
  isStreakBroken: boolean;
  canUseRestore: boolean;
  restoresRemaining: number;
  daysSinceLastSuccess: number;
  lastSuccessfulDay: Date | null;
}

/**
 * Get user's local date from UTC date and timezone
 * @param utcDate - The UTC date
 * @param timezone - User's timezone (e.g., 'America/New_York')
 * @returns Local date in user's timezone
 */
function getUserLocalDate(utcDate: Date = new Date(), timezone?: string): Date {
  if (!timezone) {
    // If no timezone provided, use UTC
    const d = new Date(utcDate);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  try {
    // Convert to user's timezone
    const userLocalTime = new Date(utcDate.toLocaleString('en-US', { timeZone: timezone }));
    return new Date(userLocalTime.getFullYear(), userLocalTime.getMonth(), userLocalTime.getDate());
  } catch (error) {
    console.error('Invalid timezone:', timezone, error);
    // Fallback to UTC
    const d = new Date(utcDate);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }
}

/**
 * Calculate days between two dates (calendar days, not 24-hour periods)
 */
function getDaysBetween(date1: Date, date2: Date): number {
  const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Check if same calendar day
 */
function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Reset monthly restores if it's a new month
 */
async function resetMonthlyRestoresIfNeeded(userId: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { restoresResetAt: true, restoresUsedThisMonth: true },
  });

  if (!user) return;

  const now = new Date();
  const lastReset = user.restoresResetAt;

  // Check if we're in a new month
  if (
    lastReset.getMonth() !== now.getMonth() ||
    lastReset.getFullYear() !== now.getFullYear()
  ) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        restoresUsedThisMonth: 0,
        restoresResetAt: now,
      },
    });
  }
}

/**
 * Get current streak status for a user
 */
export async function getStreakStatus(userId: string): Promise<StreakStatus> {
  await resetMonthlyRestoresIfNeeded(userId);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      currentStreak: true,
      lastSuccessfulDay: true,
      restoresUsedThisMonth: true,
      timezone: true,
    },
  });

  if (!user) {
    return {
      currentStreak: 0,
      isStreakBroken: false,
      canUseRestore: false,
      restoresRemaining: MAX_RESTORES_PER_MONTH,
      daysSinceLastSuccess: 0,
      lastSuccessfulDay: null,
    };
  }

  const now = new Date();
  const userToday = getUserLocalDate(now, user.timezone || undefined);
  
  const daysSinceLastSuccess = user.lastSuccessfulDay
    ? getDaysBetween(user.lastSuccessfulDay, userToday)
    : 0;

  // Streak is broken if more than MAX_GAP_DAYS (0) days passed - i.e., missed even 1 day
  const isStreakBroken = daysSinceLastSuccess > MAX_GAP_DAYS + 1;
  const restoresRemaining = MAX_RESTORES_PER_MONTH - user.restoresUsedThisMonth;
  const canUseRestore = restoresRemaining > 0 && daysSinceLastSuccess > 0;

  return {
    currentStreak: user.currentStreak,
    isStreakBroken,
    canUseRestore,
    restoresRemaining,
    daysSinceLastSuccess,
    lastSuccessfulDay: user.lastSuccessfulDay,
  };
}

/**
 * Process a check-in and update streak accordingly
 */
export async function processCheckIn(
  userId: string,
  stayedOnTrack: boolean,
  checkInDate: Date = new Date()
): Promise<{
  success: boolean;
  newStreak: number;
  message: string;
  streakBroken: boolean;
}> {
  await resetMonthlyRestoresIfNeeded(userId);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      currentStreak: true,
      lastSuccessfulDay: true,
      lastCheckIn: true,
      timezone: true,
    },
  });

  if (!user) {
    return {
      success: false,
      newStreak: 0,
      message: 'User not found',
      streakBroken: false,
    };
  }

  // Use user's local date based on their timezone
  const userToday = getUserLocalDate(checkInDate, user.timezone || undefined);

  // Check if already checked in today (in user's timezone)
  if (user.lastCheckIn) {
    const lastCheckInDate = getUserLocalDate(user.lastCheckIn, user.timezone || undefined);
    if (isSameDay(lastCheckInDate, userToday)) {
      return {
        success: false,
        newStreak: user.currentStreak,
        message: 'Already checked in today',
        streakBroken: false,
      };
    }
  }

  let newStreak = user.currentStreak;
  let streakBroken = false;

  if (stayedOnTrack) {
    // User stayed on track
    if (!user.lastSuccessfulDay) {
      // First successful day ever - start streak at 1
      newStreak = 1;
    } else {
      const lastSuccessDate = getUserLocalDate(user.lastSuccessfulDay, user.timezone || undefined);
      const daysSinceLastSuccess = getDaysBetween(lastSuccessDate, userToday);

      if (daysSinceLastSuccess === 0) {
        // Same day check-in (shouldn't happen due to check above)
        return {
          success: false,
          newStreak: user.currentStreak,
          message: 'Already checked in today',
          streakBroken: false,
        };
      } else if (daysSinceLastSuccess === 1) {
        // Next consecutive day - increment streak
        newStreak = user.currentStreak + 1;
      } else {
        // Missed one or more days - streak is broken, reset to 1
        newStreak = 1;
        streakBroken = true;
      }
    }

    // Update user with successful check-in
    await prisma.user.update({
      where: { id: userId },
      data: {
        currentStreak: newStreak,
        lastSuccessfulDay: userToday,
        lastCheckIn: checkInDate, // Store the actual UTC time for lastCheckIn
      },
    });

    // Record the check-in with user's local date
    await prisma.checkIn.create({
      data: {
        userId,
        stayedOnTrack: true,
        date: userToday, // Store user's local date
      },
    });

    return {
      success: true,
      newStreak,
      message: streakBroken
        ? `Streak restarted! Your new streak is ${newStreak} day${newStreak > 1 ? 's' : ''}.`
        : `Great job! Your streak is now ${newStreak} day${newStreak > 1 ? 's' : ''}!`,
      streakBroken,
    };
  } else {
    // User did not stay on track - break streak immediately
    streakBroken = user.currentStreak > 0; // Only mark as broken if they had a streak
    newStreak = 0; // Reset streak to 0

    // Update user
    await prisma.user.update({
      where: { id: userId },
      data: {
        currentStreak: 0,
        lastCheckIn: checkInDate, // Store the actual UTC time for lastCheckIn
      },
    });

    // Record the check-in with user's local date
    await prisma.checkIn.create({
      data: {
        userId,
        stayedOnTrack: false,
        date: userToday, // Store user's local date
      },
    });

    return {
      success: true,
      newStreak: 0,
      message: streakBroken
        ? 'Streak lost! You can use a restore if you have one available.'
        : 'Check-in recorded. Keep going tomorrow!',
      streakBroken,
    };
  }
}

/**
 * Use a restore to fix a broken streak
 */
export async function useStreakRestore(
  userId: string,
  restoreDate?: Date
): Promise<{
  success: boolean;
  message: string;
  newStreak: number;
  restoresRemaining: number;
}> {
  await resetMonthlyRestoresIfNeeded(userId);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      currentStreak: true,
      lastSuccessfulDay: true,
      restoresUsedThisMonth: true,
    },
  });

  if (!user) {
    return {
      success: false,
      message: 'User not found',
      newStreak: 0,
      restoresRemaining: 0,
    };
  }

  // Check if user has restores available
  const restoresRemaining = MAX_RESTORES_PER_MONTH - user.restoresUsedThisMonth;
  if (restoresRemaining <= 0) {
    return {
      success: false,
      message: 'No restores available this month',
      newStreak: user.currentStreak,
      restoresRemaining: 0,
    };
  }

  const now = new Date();
  const dateToRestore = restoreDate
    ? new Date(restoreDate.getFullYear(), restoreDate.getMonth(), restoreDate.getDate())
    : new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1); // Default to yesterday

  // Cannot restore future dates
  if (dateToRestore > now) {
    return {
      success: false,
      message: 'Cannot restore future dates',
      newStreak: user.currentStreak,
      restoresRemaining,
    };
  }

  // Check if the date was already successful
  const existingCheckIn = await prisma.checkIn.findFirst({
    where: {
      userId,
      date: dateToRestore,
      stayedOnTrack: true,
    },
  });

  if (existingCheckIn) {
    return {
      success: false,
      message: 'This date was already completed successfully',
      newStreak: user.currentStreak,
      restoresRemaining,
    };
  }

  // Calculate new streak after restore
  let newStreak = user.currentStreak;
  
  if (!user.lastSuccessfulDay) {
    // No previous successful day, start fresh
    newStreak = 1;
  } else {
    const daysSinceLastSuccess = getDaysBetween(user.lastSuccessfulDay, dateToRestore);
    
    if (daysSinceLastSuccess <= MAX_GAP_DAYS + 1) {
      // Within allowed gap, increment
      newStreak = user.currentStreak + 1;
    } else {
      // Was broken, restore brings it back
      newStreak = user.currentStreak > 0 ? user.currentStreak + 1 : 1;
    }
  }

  // Use the restore
  await prisma.$transaction([
    // Update user
    prisma.user.update({
      where: { id: userId },
      data: {
        currentStreak: newStreak,
        lastSuccessfulDay: dateToRestore,
        restoresUsedThisMonth: user.restoresUsedThisMonth + 1,
      },
    }),
    // Record the restore
    prisma.streakRestore.create({
      data: {
        userId,
        restoredDate: dateToRestore,
        streakAtRestore: newStreak,
        month: now.getMonth() + 1,
        year: now.getFullYear(),
      },
    }),
    // Create a check-in for that date
    prisma.checkIn.upsert({
      where: {
        userId_date: {
          userId,
          date: dateToRestore,
        },
      },
      create: {
        userId,
        stayedOnTrack: true,
        date: dateToRestore,
      },
      update: {
        stayedOnTrack: true,
      },
    }),
  ]);

  return {
    success: true,
    message: `Restore used successfully! Your streak is now ${newStreak} day${newStreak > 1 ? 's' : ''}.`,
    newStreak,
    restoresRemaining: restoresRemaining - 1,
  };
}

/**
 * Check and auto-break streaks at end of day (called by cron)
 * This ensures inactive users have their streaks reset to 0
 */
export async function checkAndBreakExpiredStreaks(): Promise<{
  brokenStreaks: number;
  usersAffected: string[];
}> {
  const now = new Date();

  // Find users with active streaks who haven't checked in recently
  const users = await prisma.user.findMany({
    where: {
      currentStreak: {
        gt: 0, // Has an active streak
      },
    },
    select: {
      id: true,
      currentStreak: true,
      lastSuccessfulDay: true,
      timezone: true,
    },
  });

  const usersAffected: string[] = [];

  for (const user of users) {
    if (!user.lastSuccessfulDay) {
      // User has a streak but no last successful day - data inconsistency, reset it
      await prisma.user.update({
        where: { id: user.id },
        data: { currentStreak: 0 },
      });
      usersAffected.push(user.id);
      continue;
    }

    // Get user's local today
    const userToday = getUserLocalDate(now, user.timezone || undefined);
    const lastSuccessDate = getUserLocalDate(user.lastSuccessfulDay, user.timezone || undefined);
    const daysSinceLastSuccess = getDaysBetween(lastSuccessDate, userToday);

    // If user hasn't checked in for more than 1 day (missed yesterday or earlier), break streak
    if (daysSinceLastSuccess > 1) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          currentStreak: 0,
        },
      });
      usersAffected.push(user.id);
    }
  }

  return {
    brokenStreaks: usersAffected.length,
    usersAffected,
  };
}

/**
 * Get restore history for a user
 */
export async function getRestoreHistory(userId: string) {
  await resetMonthlyRestoresIfNeeded(userId);

  const restores = await prisma.streakRestore.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { restoresUsedThisMonth: true },
  });

  return {
    restores,
    restoresUsedThisMonth: user?.restoresUsedThisMonth || 0,
    restoresRemaining: MAX_RESTORES_PER_MONTH - (user?.restoresUsedThisMonth || 0),
  };
}
