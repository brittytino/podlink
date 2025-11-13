import { getServerSession } from '@/lib/auth-helper';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { StreakDisplay } from '@/components/dashboard/StreakDisplay';
import { EmergencyButton } from '@/components/dashboard/EmergencyButton';
import { PodMembersList } from '@/components/dashboard/PodMembersList';
import { WeeklyProgress } from '@/components/dashboard/WeeklyProgress';
import { QuickAccessList } from '@/components/toolkit/QuickAccessList';
import { CheckInCard } from '@/components/dashboard/CheckInCard';

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
              displayName: true, // Anonymous name for privacy
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

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayCheckIn = checkIns.find((c: { date: Date }) => {
    const checkInDate = new Date(c.date);
    checkInDate.setHours(0, 0, 0, 0);
    return checkInDate.getTime() === today.getTime();
  });

  const toolkitItems = await prisma.crisisToolkitItem.findMany({
    where: { userId },
    orderBy: { orderPosition: 'asc' },
    take: 5,
  });

  return {
    user,
    checkIns: checkIns.map((c: { date: Date; stayedOnTrack: boolean }) => ({
      date: c.date.toISOString(),
      stayedOnTrack: c.stayedOnTrack,
    })),
    hasCheckedInToday: !!todayCheckIn,
    toolkitItems: toolkitItems.map((item: { id: string; title: string }) => ({
      id: item.id,
      title: item.title,
    })),
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

  const { user, checkIns, hasCheckedInToday, toolkitItems } = data;
  
  // Type assertion for pod (Prisma includes it but TypeScript needs help)
  const userWithPod = user as any;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 space-y-6 sm:space-y-8">
        {/* Header Section with Enhanced Design */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-3xl blur-2xl -z-10 animate-pulse" />
          <div className="bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-primary/10 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
                    Welcome back, {user.fullName}!
                  </h1>
                  <span className="text-3xl sm:text-4xl animate-wave inline-block">👋</span>
                </div>
                <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl leading-relaxed">
                  {user.goalDescription || 'Your accountability journey continues today'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {/* Streak Badge */}
                {user.currentStreak > 0 && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 shadow-sm">
                    <span className="text-lg animate-flicker">🔥</span>
                    <span className="text-sm font-bold text-amber-700 dark:text-amber-400">
                      {user.currentStreak} days
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-medium text-primary">Active Now</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Streak Section - Enhanced Cards */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
          <div className="group relative overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-red-500/10 to-pink-500/10 opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <StreakDisplay streak={user.currentStreak} label="Your Streak" />
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <StreakDisplay
                streak={userWithPod.pod?.totalStreak || 0}
                label="Pod Total Streak"
                isPod
              />
            </div>
          </div>
        </div>

        {/* Emergency Button - Enhanced with Pulse Effect */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-orange-500/20 to-red-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative">
            <EmergencyButton userId={user.id} podId={user.podId || ''} />
          </div>
        </div>

        {/* Daily Check-in Card - Enhanced Design */}
        <div className="relative overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-transparent" />
          <div className="relative">
            <CheckInCard hasCheckedInToday={hasCheckedInToday} userId={user.id} />
          </div>
        </div>

        {/* Pod Members & Progress - Enhanced Grid Layout */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
          {userWithPod.pod && (
            <div className="group relative overflow-hidden rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative h-full">
                <PodMembersList
                  members={userWithPod.pod.members}
                  podName={userWithPod.pod.name}
                />
              </div>
            </div>
          )}
          <div className="group relative overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative h-full">
              <WeeklyProgress checkIns={checkIns} />
            </div>
          </div>
        </div>

        {/* Quick Access Toolkit - Enhanced Card */}
        {toolkitItems.length > 0 && (
          <div className="relative overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-blue-500/5" />
            <div className="relative">
              <QuickAccessList items={toolkitItems} />
            </div>
          </div>
        )}

        {/* Footer Spacer for Mobile */}
        <div className="h-6 sm:h-8" />
      </div>

      
    </div>
  );
}