import { getServerSession } from '@/lib/auth-helper';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { StreakDisplay } from '@/components/dashboard/StreakDisplay';
import { EmergencyButton } from '@/components/dashboard/EmergencyButton';
import { PodMembersList } from '@/components/dashboard/PodMembersList';
import { WeeklyProgress } from '@/components/dashboard/WeeklyProgress';
import { QuickAccessList } from '@/components/toolkit/QuickAccessList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle } from 'lucide-react';

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
              username: true,
              avatarUrl: true,
              currentStreak: true,
              lastCheckIn: true,
            },
          },
        },
      },
    },
  });

  if (!user) return null;

  // Get last 7 days check-ins
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

  // Check if already checked in today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayCheckIn = checkIns.find((c: { date: Date }) => {
    const checkInDate = new Date(c.date);
    checkInDate.setHours(0, 0, 0, 0);
    return checkInDate.getTime() === today.getTime();
  });

  // Get toolkit items
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

async function handleCheckIn(userId: string, stayedOnTrack: boolean) {
  'use server';
  
  await fetch(`${process.env.NEXTAUTH_URL}/api/check-ins/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, stayedOnTrack }),
  });
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user.fullName}!</h1>
        <p className="text-muted-foreground">
          {user.goalDescription || 'Your accountability journey continues'}
        </p>
      </div>

      {/* Streak Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <StreakDisplay streak={user.currentStreak} label="Your Streak" />
        <StreakDisplay
          streak={user.pod?.totalStreak || 0}
          label="Pod Total Streak"
          isPod
        />
      </div>

      {/* Emergency Button */}
      <div>
        <EmergencyButton userId={user.id} podId={user.podId || ''} />
      </div>

      {/* Daily Check-in */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Check-In</CardTitle>
        </CardHeader>
        <CardContent>
          {hasCheckedInToday ? (
            <div className="flex items-center justify-center gap-2 py-4 text-green-600">
              <CheckCircle2 className="h-6 w-6" />
              <span className="font-semibold">Already checked in today! Great job!</span>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-center text-muted-foreground">
                Did you stay on track with your goal today?
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                <form
                  action={async () => {
                    'use server';
                    await handleCheckIn(user.id, true);
                  }}
                >
                  <Button type="submit" variant="default" className="w-full h-16">
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    Yes, I stayed on track!
                  </Button>
                </form>
                <form
                  action={async () => {
                    'use server';
                    await handleCheckIn(user.id, false);
                  }}
                >
                  <Button type="submit" variant="outline" className="w-full h-16">
                    <XCircle className="mr-2 h-5 w-5" />
                    No, I slipped today
                  </Button>
                </form>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pod Members & Progress */}
      <div className="grid gap-4 md:grid-cols-2">
        {user.pod && (
          <PodMembersList
            members={user.pod.members}
            podName={user.pod.name}
          />
        )}
        <WeeklyProgress checkIns={checkIns} />
      </div>

      {/* Quick Access Toolkit */}
      {toolkitItems.length > 0 && (
        <QuickAccessList items={toolkitItems} />
      )}
    </div>
  );
}
