import { getServerSession } from '@/lib/auth-helper';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { StreakDisplay } from '@/components/dashboard/StreakDisplay';
import { SwipeEmergencyButton } from '@/components/dashboard/SwipeEmergencyButton';
import { WeeklyProgress } from '@/components/dashboard/WeeklyProgress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckInButtons } from '@/components/dashboard/CheckInButtons';
import { PodMembersGrid } from '@/components/dashboard/PodMembersGrid';

async function getDashboardData(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      pod: {
        include: {
          members: {
            select: {
              id: true,
              fullName: true,
              displayName: true,
              username: true,
              avatarUrl: true,
              currentStreak: true,
              lastCheckIn: true,
            } as any,
          },
        },
      },
    },
  });

  if (!user) return null;

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const checkIns = await prisma.checkIn.findMany({
    where: {
      userId,
      date: {
        gte: sevenDaysAgo,
      },
    },
    orderBy: { date: 'desc' },
  });

  const getUserLocalDate = (utcDate: Date = new Date(), timezone?: string): Date => {
    if (!timezone) {
      const d = new Date(utcDate);
      return new Date(d.getFullYear(), d.getMonth(), d.getDate());
    }

    try {
      const userLocalTime = new Date(utcDate.toLocaleString('en-US', { timeZone: timezone }));
      return new Date(userLocalTime.getFullYear(), userLocalTime.getMonth(), userLocalTime.getDate());
    } catch (error) {
      console.error('Invalid timezone:', timezone, error);
      const d = new Date(utcDate);
      return new Date(d.getFullYear(), d.getMonth(), d.getDate());
    }
  };

  const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const now = new Date();
  const userToday = getUserLocalDate(now, user.timezone || undefined);
  
  const todayCheckIn = checkIns.find((c: { date: Date }) => {
    const checkInDate = getUserLocalDate(new Date(c.date), user.timezone || undefined);
    return isSameDay(checkInDate, userToday);
  });

  return {
    user,
    checkIns: checkIns.map((c: { date: Date; stayedOnTrack: boolean }) => ({
      date: c.date.toISOString(),
      stayedOnTrack: c.stayedOnTrack,
    })),
    hasCheckedInToday: !!todayCheckIn,
    userTimezone: user.timezone || 'UTC',
  };
}

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect('/login');
  }

  const data = await getDashboardData(session.user.id);

  if (!data) {
    redirect('/login');
  }

  const { user, checkIns, hasCheckedInToday, userTimezone } = data;
  const userWithPod = user as any;

  return (
    <div className="min-h-screen md:fixed md:inset-0 md:top-16 bg-gradient-to-br from-slate-100 via-slate-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 md:overflow-hidden overflow-y-auto">
      <div className="h-full flex flex-col px-3 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6">
        {/* Header */}
        <div className="mb-3 sm:mb-4 lg:mb-5 bg-white dark:bg-gray-900 rounded-[20px] sm:rounded-[28px] px-4 sm:px-6 py-2.5 sm:py-3.5 shadow-lg border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-white shadow-md">
                <img src={user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.fullName)}&background=random`} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-green-500 rounded-full border-[3px] border-white dark:border-gray-900" />
            </div>
            <div className="flex-1">
              <h1 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                Welcome back, {user.displayName || user.fullName}!
              </h1>
              <p className="text-[10px] sm:text-xs text-green-600 dark:text-green-400 flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                Active Now
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-3 sm:gap-4 min-h-0">
          {/* Full Width Streaks Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <StreakDisplay streak={user.currentStreak} label="Your Streak" />
            <StreakDisplay
              streak={userWithPod.pod?.totalStreak || 1}
              label="Pod Total Streak"
              isPod
            />
          </div>

          {/* Emergency Button - Full Width */}
          <div className="bg-white dark:bg-gray-900 rounded-[20px] sm:rounded-[28px] p-3 sm:p-4 border border-gray-200 dark:border-gray-800 shadow-lg">
            <SwipeEmergencyButton userId={user.id} podId={user.podId || ''} />
          </div>

          {/* Two Column Layout: Check-in/Members + Weekly Progress */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-5 min-h-0">
            {/* Left Column: Check-in and Pod Members */}
            <div className="flex flex-col min-h-0 h-full">
              <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg rounded-[20px] sm:rounded-[28px] flex-1 flex flex-col">
                {/* Check-in Section */}
                <CardHeader className="pb-2 flex-shrink-0 px-4 sm:px-6">
                  <CardTitle className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                    Today&apos;s Check-In
                  </CardTitle>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {hasCheckedInToday 
                      ? "✅ You've checked in today!" 
                      : '👋 How did your day go?'}
                  </p>
                </CardHeader>
                <CardContent className="pb-3 flex-shrink-0 px-4 sm:px-6">
                  <CheckInButtons hasCheckedInToday={hasCheckedInToday} userId={user.id} />
                </CardContent>

                {/* Pod Members Section */}
                {userWithPod.pod && (
                  <>
                    <div className="px-4 sm:px-6 pb-2 flex-shrink-0">
                      <h3 className="text-[10px] sm:text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        {userWithPod.pod.name.toUpperCase()} MEMBERS
                      </h3>
                    </div>
                    <div className="px-4 sm:px-6 pb-4 space-y-2 overflow-y-auto flex-1 min-h-0">
                      <PodMembersGrid members={userWithPod.pod.members} />
                    </div>
                  </>
                )}
              </Card>
            </div>

            {/* Right Column: Weekly Progress */}
            <div className="flex flex-col min-h-0 h-full">
              <WeeklyProgress 
                checkIns={checkIns} 
                userTimezone={userTimezone}
                currentStreak={user.currentStreak}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
