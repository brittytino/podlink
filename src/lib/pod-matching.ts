// Utility functions for pod matching logic

interface AvailabilityHours {
  start: string; // Format: "HH:mm"
  end: string; // Format: "HH:mm"
}

/**
 * Convert time string (HH:mm) to minutes since midnight
 */
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Check if two time bands overlap
 * Handles cases where time wraps around midnight (e.g., 22:00 - 02:00)
 */
export function doTimeBandsOverlap(
  band1: AvailabilityHours,
  band2: AvailabilityHours
): boolean {
  const start1 = timeToMinutes(band1.start);
  const end1 = timeToMinutes(band1.end);
  const start2 = timeToMinutes(band2.start);
  const end2 = timeToMinutes(band2.end);

  // Handle wrap-around (e.g., 22:00 - 02:00)
  if (end1 < start1) {
    // Band1 wraps around midnight
    return (
      start2 >= start1 ||
      start2 <= end1 ||
      (end2 >= start1 && end2 <= end1) ||
      (end2 < start2 && end2 <= end1)
    );
  }

  if (end2 < start2) {
    // Band2 wraps around midnight
    return (
      start1 >= start2 ||
      start1 <= end2 ||
      (end1 >= start2 && end1 <= end2) ||
      (end1 < start1 && end1 <= end2)
    );
  }

  // Normal case: no wrap-around
  return start1 < end2 && start2 < end1;
}

/**
 * Calculate overlap duration in minutes
 */
export function getOverlapDuration(
  band1: AvailabilityHours,
  band2: AvailabilityHours
): number {
  const start1 = timeToMinutes(band1.start);
  const end1 = timeToMinutes(band1.end);
  const start2 = timeToMinutes(band2.start);
  const end2 = timeToMinutes(band2.end);

  if (!doTimeBandsOverlap(band1, band2)) {
    return 0;
  }

  // Handle wrap-around cases
  if (end1 < start1 || end2 < start2) {
    // Simplified: if they overlap, return minimum of both durations
    const duration1 = end1 < start1 ? 24 * 60 - start1 + end1 : end1 - start1;
    const duration2 = end2 < start2 ? 24 * 60 - start2 + end2 : end2 - start2;
    return Math.min(duration1, duration2);
  }

  const overlapStart = Math.max(start1, start2);
  const overlapEnd = Math.min(end1, end2);
  return Math.max(0, overlapEnd - overlapStart);
}

/**
 * Calculate responsiveness score based on:
 * - Time-band overlap (higher overlap = higher score)
 * - Recent activity (check-ins, messages)
 * - Account age (newer accounts get slight boost to encourage matching)
 */
export function calculateResponsivenessScore(
  user1: {
    availabilityHours: AvailabilityHours;
    currentStreak: number;
    lastCheckIn: Date | null;
    createdAt: Date;
  },
  user2: {
    availabilityHours: AvailabilityHours;
    currentStreak: number;
    lastCheckIn: Date | null;
    createdAt: Date;
  }
): number {
  let score = 0;

  // Time-band overlap (0-50 points)
  const overlapMinutes = getOverlapDuration(user1.availabilityHours, user2.availabilityHours);
  const maxOverlap = 24 * 60; // 24 hours in minutes
  score += (overlapMinutes / maxOverlap) * 50;

  // Streak bonus (0-25 points)
  const avgStreak = (user1.currentStreak + user2.currentStreak) / 2;
  score += Math.min(25, avgStreak * 2); // Cap at 25 points

  // Recent activity (0-15 points)
  const now = new Date();
  const daysSinceCheckIn1 = user1.lastCheckIn
    ? (now.getTime() - user1.lastCheckIn.getTime()) / (1000 * 60 * 60 * 24)
    : 999;
  const daysSinceCheckIn2 = user2.lastCheckIn
    ? (now.getTime() - user2.lastCheckIn.getTime()) / (1000 * 60 * 60 * 24)
    : 999;
  const avgDaysSinceCheckIn = (daysSinceCheckIn1 + daysSinceCheckIn2) / 2;
  if (avgDaysSinceCheckIn < 1) score += 15;
  else if (avgDaysSinceCheckIn < 3) score += 10;
  else if (avgDaysSinceCheckIn < 7) score += 5;

  // Account age bonus for new users (0-10 points)
  const accountAge1 = (now.getTime() - user1.createdAt.getTime()) / (1000 * 60 * 60 * 24);
  const accountAge2 = (now.getTime() - user2.createdAt.getTime()) / (1000 * 60 * 60 * 24);
  const avgAccountAge = (accountAge1 + accountAge2) / 2;
  if (avgAccountAge < 7) score += 10; // New users get boost
  else if (avgAccountAge < 30) score += 5;

  return Math.min(100, score); // Cap at 100
}

